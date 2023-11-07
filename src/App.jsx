import { useState } from "react";
import * as buffer from "buffer";
import "./App.css";

import {
  Connection,
  PublicKey,
  clusterApiUrl,
  Keypair,
  LAMPORTS_PER_SOL,
  Transaction,
  SystemProgram,
  sendAndConfirmTransaction
} from "@solana/web3.js";





function App() {
  window.Buffer = buffer.Buffer;

  const [privateKey, setPrivateKey] = useState(undefined);

  const [connectToPhantomClicked, setconnectToPhantomClicked] = useState(false);

  const [createWalletText, setCreateWalletText] = useState(
    "CREATE A NEW SOLANA ACCOUNT"
  );

  const [connectWalletText, setConnectWalletText] = useState(
    "CONNECT TO PHANTOM WALLET"
  );

  const [walletBalanceText, setWalletBalanceText] = useState(0);

  const isPhantomAvailable = window.phantom;

  const createAccFun = async () => {
    try {
      const newonepair = new Keypair();
      const publicKey = new PublicKey(newonepair._keypair.publicKey).toString();
      const key = newonepair._keypair.secretKey;
      setPrivateKey(key);

      


      const connection = new Connection("http://127.0.0.1:8899", "confirmed");
      const wallet = await Keypair.fromSecretKey(key);
      console.log(`AIRDROPPING SOLANA TO WALLET! ${publicKey}`);
      console.log(publicKey);
      console.log(key);
      var fromAirDropSignature = await connection.requestAirdrop(
        new PublicKey(wallet.publicKey),
        24 * LAMPORTS_PER_SOL
      );
      await connection.confirmTransaction(fromAirDropSignature);

      alert(`ACCOUNT CREATED & AIRDROPED 24 SOL TO${publicKey}`);
      console.log(`ACCOUNT CREATED & AIRDROPPED 24 SOL TO ${publicKey}`);
      
    } catch (error) {
      alert(error);
      console.log(error);
    }
  };

  const connectToWALLETFunction = async () => {
    try {
      const response = await solana.connect();

      console.log(
        `CONNECTED TO PHANTOM WALLET ${response.publicKey.toString()}`
      );
      alert("CONNECTED TO PHANTOM WALLET");
      setConnectWalletText("CONNECTED TO WALLET");
      setconnectToPhantomClicked(true);
    } catch (error) {
      alert(error);
      console.log(error);
    }
  };

  const transfertoSOLFun = async () => {
    try {
      const connection = new Connection("http://127.0.0.1:8899", "confirmed");
      

      var from = Keypair.fromSecretKey(Uint8Array.from(privateKey));

      console.log(from.secretKey);

      let latestBlockHash = await connection.getLatestBlockhash();
      

      var transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: from.publicKey,
          toPubkey: window.solana.publicKey,
          lamports: LAMPORTS_PER_SOL * 23,
        })
      );

      var signature = await sendAndConfirmTransaction(
        connection,
        transaction,
        [from]
    );

      console.log(signature)
      alert("transfered SOL");
      setWalletBalanceText(138);
    } catch (error) {
      alert(error);
      console.log(error);
    }
  };



  return (
    <>
      <h1 className="text-3xl font-bold underline mb-4">INTEGRATION OF SOLANA WALLET</h1>
      {isPhantomAvailable && (
        <div>
          <div>
            <button
              id="createAccount"
              className={`text-white bg-gradient-to-br from-green-400 to-blue-600 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2`}
              onClick={createAccFun}
            >
              {createWalletText}
            </button>
          </div>
          <div>
            <button
              id="connectToPhantom"
              className={`text-white bg-gradient-to-br from-green-400 to-blue-600 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2`}
              onClick={connectToWALLETFunction}
            >
              {connectWalletText}
            </button>
          </div>
        </div>
      )}

      {!isPhantomAvailable && (
        <p className="">
          No provider found. Install{" "}
          <a
            href="https://phantom.app/"
            className="underline text-blue-600 hover:text-blue-800 visited:text-purple-600"
          >
            Phantom Browser extension
          </a>
        </p>
      )}

      <div>
        <button
          id="transferSOL"
          className={`text-white bg-gradient-to-br from-green-400 to-blue-600 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2${
            !connectToPhantomClicked ? "opacity-50 cursor-not-allowed" : ""
          } `}
          // className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4"
          onClick={transfertoSOLFun}
          disabled={!connectToPhantomClicked}
        >
          TRANSFER TO NEW WALLET
        </button>
      </div>

      <h2>ACCOUNT BALANCE: {walletBalanceText} SOL</h2>
    </>
  );
}

export default App;
