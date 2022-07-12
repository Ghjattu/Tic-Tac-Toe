function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return squares[a];
        }
    }
    return null;
}

function Square(props) {
    return (
        <button className="square" onClick={props.onClick}>
            {props.value}
        </button>
    );
}

class Board extends React.Component {
    renderSquare(i) {
        return <Square value={this.props.squares[i]} onClick={() => this.props.onClick(i)} key={i}/>;
    }

    render() {
        /*
         * 通过循环渲染 n * n 的棋盘
         */
        const n = Math.sqrt(this.props.squares.length);
        const board = [];
        for (let row = 0; row < n; row++) {
            const boardRow = [];
            for (let column = 0; column < n; column++) {
                boardRow.push(this.renderSquare(row * n + column));
            }
            board.push(<div className="board-row" key={row}>{boardRow}</div>);
        }

        return (
            <div>
                <span className="x origin">0</span>
                <span className="y origin">0</span>
                {board}
            </div>
        );
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            boardSize: 9,
            history: [{
                squares: Array(9).fill(null),
                isX: false,         // 判断当前棋子是否为'X'
                xCoordinate: -1,    // 横轴为x轴，纵轴为y轴，左上角坐标为(0,0)
                yCoordinate: -1
            }],
            xIsNext: true,
            stepNumber: 0
        };
        this.handleChange = this.handleChange.bind(this);
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        if (calculateWinner(squares) || squares[i]) {
            return;
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        const isX = this.state.xIsNext;
        const xCoordinate = i % 3;
        const yCoordinate = Math.floor(i / 3);

        this.setState(preState => ({
            history: history.concat([{
                squares: squares,
                isX: isX,
                xCoordinate: xCoordinate,
                yCoordinate: yCoordinate
            }]),
            xIsNext: !preState.xIsNext,
            stepNumber: history.length
        }));
    }

    jumpTo(step) {
        this.setState({
            xIsNext: (step % 2 === 0),
            stepNumber: step
        })
    }

    handleChange(event) {
        this.setState({
            boardSize: parseInt(event.target.value),
            history: [{
                squares: Array(parseInt(event.target.value)).fill(null),
                isX: false,
                xCoordinate: -1,
                yCoordinate: -1
            }],
            xIsNext: true,
            stepNumber: 0
        });
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);
        let status;
        if (winner) {
            status = `Winner: ${winner}`;
        } else {
            status = `Next player: ${this.state.xIsNext ? 'X' : 'O'}`;
        }

        const moves = history.map((step, move) => {
            const desc = move ? `Go to move #${move}` : `Go to game start`;
            const coordinate = `: ${step.isX ? 'X' : 'O'} located (${step.xCoordinate},${step.yCoordinate})`;
            return (
                <li key={move}>
                    <button className={move === this.state.stepNumber ? "bold" : ""}
                            onClick={() => this.jumpTo(move)}>{desc}{move > 0 && coordinate}</button>
                </li>
            );
        });

        return (
            <div>
                <div className="selector">
                    <label htmlFor="board-size">
                        board size :
                        <select name="sizes" id="board-size" value={this.state.boardSize}
                                onChange={this.handleChange}>
                            <option value="9">9</option>
                            <option value="16">16</option>
                            <option value="25">25</option>
                            <option value="36">36</option>
                        </select>
                    </label>
                </div>
                <div className="game">
                    <div className="game-board">
                        <Board squares={current.squares} onClick={(i) => this.handleClick(i)}/>
                    </div>
                    <div className="game-info">
                        <div>{status}</div>
                        <ol>{moves}</ol>
                    </div>
                </div>
            </div>
        );
    }
}

// class GamePanel extends React.Component {
//     constructor(props) {
//         super(props);
//         this.state = {
//             boardSize: 9
//         }
//         this.handleChange = this.handleChange.bind(this);
//     }
//
//     handleChange(event) {
//         this.setState({
//             boardSize: parseInt(event.target.value)
//         })
//     }
//
//     render() {
//         return (
//             <div>
//                 <div className="selector">
//                     <label htmlFor="board-size">
//                         board size :
//                         <select name="sizes" id="board-size" value={this.state.boardSize}
//                                 onChange={this.handleChange}>
//                             <option value="9">9</option>
//                             <option value="16">16</option>
//                             <option value="25">25</option>
//                             <option value="36">36</option>
//                         </select>
//                     </label>
//                 </div>
//                 <Game boardSize={this.state.boardSize}/>
//             </div>
//         );
//     }
// }

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game/>);
