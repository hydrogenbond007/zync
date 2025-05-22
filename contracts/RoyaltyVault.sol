// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/ReentrancyGuardUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

error NotInitialized();
error NoShares();
error NoDividends();
error TransferFailed();

/// @custom:security This contract is cloneable; call initialize() exactly once.
contract RoyaltyVault is
    Initializable,
    ERC20Upgradeable,
    OwnableUpgradeable,
    ReentrancyGuardUpgradeable
{
    uint256 private constant MAGNITUDE = 2 ** 128;

    uint256 private magnifiedDividendPerShare;
    uint256 public totalDividendsDistributed;
    mapping(address => int256) private magnifiedDividendCorrections;
    mapping(address => uint256) public withdrawnDividends;
    
    // Video metadata
    uint256 public videoNftId;
    string public videoUri;

    event RoyaltiesRecorded(uint256 amount);
    event DividendsClaimed(address indexed holder, uint256 amount);

    // Make contract able to receive ETH
    receive() external payable {
        recordRoyalties(msg.value);
    }

    /// @notice Initialize vault clone. Mints 1 billion tokens to `owner_`.
    function initialize(
        string calldata name_,
        string calldata symbol_,
        address owner_,
        uint256 videoNftId_,
        string calldata videoUri_
    ) external initializer {
        if (owner_ == address(0))
            revert NotInitialized();

        __ERC20_init(name_, symbol_);
        __Ownable_init(owner_);
        __ReentrancyGuard_init();

        videoNftId = videoNftId_;
        videoUri = videoUri_;
        
        // Mint 1 billion tokens (70% to creator, 30% for public sale)
        uint256 totalSupply = 1_000_000_000 * 10 ** decimals();
        uint256 creatorShare = (totalSupply * 70) / 100;
        uint256 publicShare = totalSupply - creatorShare;
        
        _mint(owner_, creatorShare);
        _mint(address(this), publicShare);
    }

    /// @notice Record `amount` of royalties.
    function recordRoyalties(uint256 amount) public payable {
        if (totalSupply() == 0) revert NoShares();
        
        // For direct calls, ensure msg.value matches amount
        if (msg.sender != address(this) && msg.value != amount) {
            amount = msg.value;
        }
        
        magnifiedDividendPerShare += (amount * MAGNITUDE) / totalSupply();
        totalDividendsDistributed += amount;
        emit RoyaltiesRecorded(amount);
    }

    /// @notice Withdraw all unpaid dividends.
    function claimDividends() external nonReentrant {
        uint256 owed = withdrawableDividendOf(msg.sender);
        if (owed == 0) revert NoDividends();
        
        withdrawnDividends[msg.sender] += owed;
        
        (bool success, ) = msg.sender.call{value: owed}("");
        if (!success) revert TransferFailed();
        
        emit DividendsClaimed(msg.sender, owed);
    }
    
    /// @notice Allow users to buy tokens from the public share
    function buyTokens(uint256 amount, uint256 pricePerToken) external payable {
        require(amount > 0, "Amount must be greater than 0");
        require(balanceOf(address(this)) >= amount, "Not enough tokens available");
        require(msg.value >= amount * pricePerToken, "Insufficient payment");
        
        // Transfer tokens to buyer
        _transfer(address(this), msg.sender, amount);
        
        // Send ETH to creator
        (bool success, ) = owner().call{value: msg.value}("");
        require(success, "Failed to send ETH to creator");
    }

    function withdrawableDividendOf(
        address acct
    ) public view returns (uint256) {
        return accumulativeDividendOf(acct) - withdrawnDividends[acct];
    }

    function accumulativeDividendOf(
        address acct
    ) public view returns (uint256) {
        return
            uint256(
                int256(magnifiedDividendPerShare * balanceOf(acct)) +
                    magnifiedDividendCorrections[acct]
            ) / MAGNITUDE;
    }

    /// @dev Hook for all token mints/burns/transfers in OZ v5
    function _update(
        address from,
        address to,
        uint256 amount
    ) internal virtual override {
        super._update(from, to, amount);

        if (from == address(0)) {
            // mint
            magnifiedDividendCorrections[to] -= int256(
                magnifiedDividendPerShare * amount
            );
        } else if (to == address(0)) {
            // burn
            magnifiedDividendCorrections[from] += int256(
                magnifiedDividendPerShare * amount
            );
        } else {
            // transfer
            int256 corr = int256(magnifiedDividendPerShare * amount);
            magnifiedDividendCorrections[from] += corr;
            magnifiedDividendCorrections[to] -= corr;
        }
    }
} 