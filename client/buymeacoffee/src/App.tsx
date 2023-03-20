import { useState, useEffect } from 'react'
import abi from '../../../artifacts/contracts/BuyMeACoffee.sol/BuyMeACoffee.json'
import { ethers } from "ethers";
import { SiEthereum } from 'react-icons/si';
import './App.css'


const App = () => {

  const contractAddress = "0xdF36EB526124cDf65710712ee7d2cCCe0A499BBb";
  const contractABI = abi.abi;

  const [currentAccount, setCurrentAccount] = useState("");
  const [buyingCoffee, setBuyingCoffee] = useState(false);
  const [coffeeBought, setCoffeeBought] = useState(false);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");

  const onNameChange = (event: React.FormEvent<HTMLInputElement>) => {
    setName(event.currentTarget.value);
  }

  const onMessageChange = (event: React.FormEvent<HTMLTextAreaElement>) => {
    setMessage(event.currentTarget.value);
  }

  const isWalletConnected = async () => {
    try {
      // @ts-ignore
      const { ethereum } = window;

      const accounts = await ethereum.request({ method: 'eth_accounts' })
      console.log("accounts: ", accounts);

      if (accounts.length > 0) {
        const account = accounts[0];
        console.log("wallet is connected! " + account);
      } else {
        console.log("make sure MetaMask is connected");
      }
    } catch (error) {
      console.log("error: ", error);
    }
  }

  const connectWallet = async () => {
    try {
      // @ts-ignore
      const { ethereum } = window;

      if (!ethereum) {
        console.log("please install MetaMask");
        return;
      }

      const accounts = await ethereum.request({
        method: 'eth_requestAccounts'
      });

      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error);
    }
  }

  const buyCoffee = async () => {
    try {

      if (name && message) {
        // @ts-ignore
        const { ethereum } = window;

        if (ethereum) {
          const provider = new ethers.providers.Web3Provider(ethereum, "any");
          const signer = provider.getSigner();
          const buyMeACoffee = new ethers.Contract(
            contractAddress,
            contractABI,
            signer
          );

          setBuyingCoffee(true);
          console.log("buying coffee..")
          const coffeeTxn = await buyMeACoffee.buyCoffee(
            name ? name : "Waqas",
            message ? message : "Enjoy your coffee!",
            { value: ethers.utils.parseEther("0.01") }
          );

          await coffeeTxn.wait();

          setBuyingCoffee(false);
          setCoffeeBought(true);
          console.log("mined ", coffeeTxn.hash);
          console.log("coffee purchased!");

          // Clear the form fields.
          setName("");
          setMessage("");
        }
      } else {
        window.alert("Your nice name and a lovely message both are required!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    let buyMeACoffee;
    setCoffeeBought(false);
    isWalletConnected();
    // getMemos();

    // @ts-ignore
    const { ethereum } = window;

    // Listen for new memo events.
    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum, "any");
      const signer = provider.getSigner();
      buyMeACoffee = new ethers.Contract(
        contractAddress,
        contractABI,
        signer
      );

    }

    return

  }, []);

  return (
    <div className="App">
      <h1 className="text-6xl font-bold text-red-700">Buy Waqas a coffee!</h1>
      {currentAccount ? (
        <div className="mt-5">
          <form>
            <div>
              <label>
                Name
              </label>
              <br />

              <input
                id="name"
                type="text"
                placeholder="Your name"
                onChange={onNameChange}
                className="text-black px-2 py-1 rounded-sm"
                value={name}
              />
            </div>
            <br />
            <div>
              <label>
                Send Waqas a message
              </label>
              <br />

              <textarea
                rows={3}
                placeholder="Enjoy your coffee!"
                id="message"
                onChange={onMessageChange}
                required
                className="text-black px-2 py-1 rounded-sm"
                value={message}
              >
              </textarea>
            </div>
            <div>
              <button
                type="button"
                onClick={buyCoffee}
                className="mt-1 inline-block px-6 py-2.5 bg-red-600 text-white font-medium text-xs leading-tight uppercase rounded-full shadow-md hover:bg-red-700 hover:shadow-lg focus:bg-red-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-red-800 active:shadow-lg transition duration-150 ease-in-out"
                disabled={buyingCoffee}
              >
                <div className="flex items-center">
                  <SiEthereum fontSize={21} color="white" />
                  <p>Send 1 Coffee for 0.01 ETH</p>
                </div>
              </button>
              {
                buyingCoffee && (
                  <div className="flex justify-center items-center py-3">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-700" />
                  </div>
                )
              }
              {
                coffeeBought && (
                  <div className="flex justify-center items-center py-3">
                    <img src="https://gifsec.com/wp-content/uploads/2022/09/thank-you-gif-30.gif" alt="Thank You GIF" />
                  </div>
                )
              }
            </div>
          </form>
        </div>
      ) : (
        <button onClick={connectWallet} type="button" className="mt-4 inline-block px-6 py-2.5 bg-red-600 text-white font-medium text-xs leading-tight uppercase rounded-full shadow-md hover:bg-red-700 hover:shadow-lg focus:bg-red-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-red-800 active:shadow-lg transition duration-150 ease-in-out"><div className="flex items-center">
          <SiEthereum fontSize={21} color="white" />
          <p>Connect Wallet</p>
        </div></button>
      )}


    </div>
  )
}

export default App
