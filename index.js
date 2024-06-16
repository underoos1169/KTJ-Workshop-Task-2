const cells = document.querySelectorAll(".cell");
const otherText = document.querySelector("#OtherText");
const RestartButton = document.querySelector("#Restart");
const LeaderboardTable = document.querySelector("#Scoreboard tbody");
const ResetLeaderboardButton = document.querySelector("#ResetLeaderboard");
const player1NameInput = document.querySelector("#player1Name");
const player2NameInput = document.querySelector("#player2Name");

const WinConditions = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [2,4,6]];

let Options = ["", "", "", "", "", "", "", "", ""];

let CurrentPlayer = "X";
let CurrentPlayerName = "Player 1"

let GameRunning = false;

let GameCount = 0;

function init(){
    cells.forEach(cell => cell.addEventListener("click", CellClicked));
    RestartButton.addEventListener("click", RestartGame);
    ResetLeaderboardButton.addEventListener("click", resetLeaderboard);
    player1NameInput.addEventListener("input",updatePlayerNames);
    player2NameInput.addEventListener("input",updatePlayerNames);
    otherText.textContent = `${CurrentPlayerName}'s turn`;
    StatusText.textContent = `Player 1: X Player 2: O`;
    LoadLeaderboard();
    GameRunning = true;
}

function updatePlayerNames(){
    if(CurrentPlayer == "X")
        CurrentPlayerName = player1NameInput.value || "Player 1";
    else
        CurrentPlayerName = player2NameInput.value || "Player 2";
    otherText.textContent = `${CurrentPlayerName}'s turn`;
}

function CellClicked(){
    const cellIndex = this.getAttribute("cellIndex");

    if(Options[cellIndex] != "" || !GameRunning)
    {
        return;
    }
    UpdateCell(this, cellIndex);
    CheckWinner();
}

function UpdateCell(cell, index){
    Options[index] = CurrentPlayer;
    cell.textContent = CurrentPlayer;

    if(CurrentPlayer == "X")
    {
        cell.classList.add("cell-X");
        cell.classList.remove("cell-O");
    }
    else
    {
        cell.classList.add("cell-O");
        cell.classList.remove("cell-X");
    }
}

function SwitchPlayer(){
    if(CurrentPlayer == "X")
    {
        CurrentPlayer = "O";
        CurrentPlayerName = player1NameInput.value || "Player 2";
    }
    else
    {    
        CurrentPlayer = "X";
        CurrentPlayerName = player1NameInput.value || "Player 1";
    }

    otherText.textContent = `${CurrentPlayerName}'s turn`;
}

function CheckWinner(){
    let RoundWon = false;
    let WinningCombination = [];

    for(let i = 0; i<WinConditions.length;i++)
    {
        const condn = WinConditions[i];
        const cellA = Options[condn[0]];
        const cellB = Options[condn[1]];
        const cellC = Options[condn[2]];
        if(cellA == "" || cellB=="" || cellC=="")   continue;
        if(cellA == cellB && cellB==cellC)
        {
            RoundWon = true;
            WinningCombination = condn;
            break;
        }
    }

    if(RoundWon == true)
    {
        otherText.textContent = `${CurrentPlayerName} won`;
        GameRunning = false;
        HighlightWinningCells(WinningCombination);
        UpdateScoreboard(CurrentPlayerName);
        setTimeout(RestartGame, 5000);
    }
    else if(!Options.includes(""))
    {
        otherText.textContent = `Draw!`;
        GameRunning = false;
        UpdateScoreboard("Draw");
        setTimeout(RestartGame,5000);
    }
    else    SwitchPlayer();
}

function HighlightWinningCells(WinningCombination){
    cells.forEach((cell,index) => {
        if(!WinningCombination.includes(index))
            cell.classList.remove("cell-X","cell-O");
    });
}

function UpdateScoreboard(winner){
    GameCount++;
    const NewRow = document.createElement("tr");
    const GameCell = document.createElement("td");
    const WinnerCell = document.createElement("td");

    GameCell.textContent = GameCount;
    WinnerCell.textContent = winner;
    NewRow.appendChild(GameCell);
    NewRow.appendChild(WinnerCell);
    LeaderboardTable.appendChild(NewRow);
    SaveLeaderboard();
}

function SaveLeaderboard()
{
    const LeaderboardData = [];
    LeaderboardTable.querySelectorAll("tr").forEach(row => {
        const game = row.children[0].textContent;
        const winner = row.children[1].textContent;
        LeaderboardData.push({game,winner});
    })
    localStorage.setItem("leaderboard",JSON.stringify(LeaderboardData));
}

function LoadLeaderboard(){
    const SavedData = localStorage.getItem("leaderboard");
    if(SavedData){
        const LeaderboardData = JSON.parse(SavedData);
        LeaderboardData.forEach(entry => {
            const NewRow = document.createElement("tr");
            const GameCell = document.createElement("td");
            const WinnerCell = document.createElement("td");

            GameCell.textContent = entry.game;
            WinnerCell.textContent = entry.winner;

            NewRow.appendChild(GameCell);
            NewRow.appendChild(WinnerCell);

            LeaderboardTable.appendChild(NewRow);
        });
        GameCount = LeaderboardData.length;
    }
}

function resetLeaderboard() {
    localStorage.removeItem("leaderboard");
    LeaderboardTable.innerHTML ="";
    GameCount = 0;
    location.reload();
}

function RestartGame(){
    CurrentPlayer = "X";
    CurrentPlayerName = player1NameInput.value || "Player 1";
    Options = ["","","","","","","","",""];
    otherText.textContent = `${CurrentPlayerName}'s turn`;
    cells.forEach(cell => {
        cell.textContent = ""; 
        cell.classList.remove("cell-X","cell-O")
    });
    GameRunning = true;
}

init();