import { Component } from "react";
import "./App.css";
import web3 from "./web3";
import lottery from "./lottery";

class App extends Component {
  state = {
    manager: "",
    players: [],
    balance: "",
    inputValue: "",
    message: "",
  };

  async componentDidMount() {
    const manager = await lottery.methods.manager().call();
    const players = await lottery.methods.getplayers().call();
    //balance isn't actually a number. It is an object (BigNum)
    const balance = await web3.eth.getBalance(lottery.options.address);

    this.setState({ manager, players, balance });
  }

  inputHandler = (event) => {
    this.setState({ inputValue: event.target.value });
  };

  submitHandler = async (event) => {
    event.preventDefault();

    const accounts = await web3.eth.requestAccounts();

    this.setState({ message: "Waiting for transaction success" });

    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei(this.state.inputValue, "ether"),
    });

    this.setState({ message: "You have been entered" });
  };

  clickHandler = async () => {

    const accounts = await web3.eth.requestAccounts();

    this.setState({ message: "Waiting for transaction success" });

    await lottery.methods.pickWinner().send({
      from: accounts[0]
    });
    
    this.setState({ message: "You have been entered" });

  };

  render() {
    web3.eth.requestAccounts().then(console.log).catch(console.error);
    console.log(web3.version);

    return (
      <div className="App">
        <h2>Lottery Contract</h2>
        <p>
          This contract is managed by {this.state.manager}. There are currently{" "}
          {this.state.players.length} competing to win{" "}
          {web3.utils.fromWei(this.state.balance, "ether")}
        </p>
        <hr />
        <form onSubmit={this.submitHandler}>
          <h4>Want to try your luck?</h4>
          <div>
            <label>Amount of ether to enter</label>
            <input
              type="text"
              onChange={this.inputHandler}
              value={this.state.inputValue}
            />
          </div>
          <button>Enter</button>
        </form>

        <hr />
        <p>Ready to pick a winner?</p>
        <button onClick={this.clickHandler}>Pick a winner</button>

        <hr />
        <p>{this.state.message}</p>
        
      </div>
    );
  }
}

export default App;
