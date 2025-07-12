// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IERC20 {
    function transfer(address recipient, uint256 amount) external returns (bool);
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
}

contract CHZBetPool {
    enum Team { None, A, B }

    address public owner;
    address public feeWallet;

    // ✅ Adresse CHZ testnet avec checksum valide pour Solidity
    IERC20 public chzToken = IERC20(0x5Ddc7d33bf19Bd7E568e595AaefbE6Bfb52afD42);

    bool public matchEnded = false;
    Team public winner;

    uint256 public totalBetA;
    uint256 public totalBetB;

    uint256 public constant FEE_PERCENT = 5;

    struct Bet {
        uint256 amount;
        Team team;
        bool claimed;
    }

    mapping(address => Bet) public bets;

    modifier onlyOwner() {
        require(msg.sender == owner, "Not authorized");
        _;
    }

    constructor(address _feeWallet) {
        owner = msg.sender;
        feeWallet = _feeWallet;
    }

    function placeBet(uint256 amount, Team team) external {
        require(!matchEnded, "Betting is closed");
        require(team == Team.A || team == Team.B, "Invalid team");
        require(bets[msg.sender].amount == 0, "Already bet");

        // ✅ Correction ici : vérification explicite du transfert
        require(chzToken.transferFrom(msg.sender, address(this), amount), "TransferFrom failed");

        if (team == Team.A) {
            totalBetA += amount;
        } else {
            totalBetB += amount;
        }

        bets[msg.sender] = Bet(amount, team, false);
    }

    function declareWinner(Team _winner) external onlyOwner {
        require(!matchEnded, "Already declared");
        require(_winner == Team.A || _winner == Team.B, "Invalid winner");

        winner = _winner;
        matchEnded = true;
    }

    function claimReward() external {
        require(matchEnded, "Match not ended");
        Bet storage userBet = bets[msg.sender];
        require(!userBet.claimed, "Already claimed");
        require(userBet.team == winner, "You lost");

        uint256 totalWinnerPool = (winner == Team.A) ? totalBetA : totalBetB;
        uint256 totalLoserPool = (winner == Team.A) ? totalBetB : totalBetA;

        uint256 totalRewardPool = totalWinnerPool + totalLoserPool;
        uint256 userShare = (userBet.amount * totalRewardPool) / totalWinnerPool;

        uint256 fee = (userShare * FEE_PERCENT) / 100;
        uint256 finalReward = userShare - fee;

        userBet.claimed = true;

        require(chzToken.transfer(msg.sender, finalReward), "Reward transfer failed");
        require(chzToken.transfer(feeWallet, fee), "Fee transfer failed");
    }

    function withdrawRemainingCHZ(address to) external onlyOwner {
        require(matchEnded, "Only after match ends");
        uint256 balance = chzToken.balanceOf(address(this));
        require(chzToken.transfer(to, balance), "Withdraw failed");
    }
}
