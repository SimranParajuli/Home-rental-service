// var Web3= require("web3");
const App = {
    contracts: {},
    networkId: 5777,
    load: async () => {
        console.log("LOADING");
        await App.loadWeb3();
        await App.getAccount();
        await App.initContract();
        // await App.loadWalletBalance();
        },

        bindEvents: function () {
            $(document).on("click", ".bookNow", async function (e) {
              let $this = $(this);
              App.btnLoading($this);
              try {
                await App.addDeposit(e);
              } catch (e) {
                App.btnReset($this);
              }
              App.btnReset($this);
            });

            $(document).on("click", ".withdraw", async function (e) {
              let $this = $(this);
              App.btnLoading($this);
              try {
                await App.withdraw(e);
              } catch (e) {
                App.btnReset($this);
              }
              App.btnReset($this);
            });
        
            // $(document).on("click", ".btn-vote", async function (e) {
            //   var $this = $(this);
            //   App.btnLoading($this);
            //   try {
            //     await App.handleAddVote(e);
            //   } catch (e) {
            //     App.btnReset($this);
            //   }
            //   App.btnReset($this);
            // });
        
            // window.ethereum.on("accountsChanged", function (account) {
            //   App.getAllProposals();
            // });
          },   


    loadWeb3: async () => {
        console.log("here")
        if (typeof web3 !== "undefined") {
            App.web3Provider = web3.currentProvider;
            web3 = new Web3(web3.currentProvider);
        } else {
            window.alert("Please connect to Metamask.");
        }
        // Modern dapp browsers...
        if (window.ethereum) {
            window.web3 = new Web3(ethereum);
            try {
                // Request account access if needed
                await ethereum.enable();
                // Acccounts now exposed
                // web3.eth.sendTransaction({
                //     /* ... */
                // });
            } catch (error) {
                // User denied account access...
            }
        }
        // Legacy dapp browsers...
        else if (window.web3) {
            App.web3Provider = web3.currentProvider;
            window.web3 = new Web3(web3.currentProvider);
            // Acccounts always exposed
            web3.eth.sendTransaction({
                /* ... */
            });
        }
        // Non-dapp browsers...
        else {
            console.log(
                "Non-Ethereum browser detected. You should consider trying MetaMask!"
            );
        }
    },

    getAccount: async function () {
        let accounts = await web3.eth.getAccounts();
        console.log("ACCOUNT",accounts);
        return accounts[0];
      },

    // loadAccount: async () => {
    //     // Set the current blockchain account
    //     console.log(web3.eth.accounts);
    //     App.account = web3.eth.accounts[0];
    //     // $("#account").val(App.account);
    //     // $("#account-farmer").val(App.account);
    //     // $("#account-crowdfarmer").val(App.account);
    //     console.log("Account Loaded",App.account);
    //     setTimeout(() => console.log(App.account), 2000);
    // },

    loadWalletBalance: () => {
        console.log('Balance');
        this.web3.eth.getBalance(App.account, (err, balance) => {
            this.balance = this.web3.fromWei(balance, "ether") + " ETH";
            console.log(this.balance);
        }); 
    },

    // loadContract: async () => {
    //     // Create a JavaScript version of the smart contract
    //     const escrow = await $.getJSON("build/contracts/Escrow.json");
    //     console.log("escrow file",escrow)
    //     App.contracts.Escrow = TruffleContract(escrow);
    //     App.contracts.Escrow.setProvider(App.web3Provider);

    //     // Hydrate the smart contract with values from the blockchain
    //     App.escrow = await App.contracts.Escrow.deployed();
    //     console.log("Escrow Contract Loaded");
    // },

    // deposit: async function (form) {
    //     let address = $(form)
    //         .find('[name="address"]')
    //         .val();
    //     let amount = $(form)
    //         .find('[name="amount"]')
    //         .val();
    //     const contractInstance = await App.contracts.Escrow.deployed();
    //     contractInstance.deposit(address, { value: amount }).then(() => {
    //         console.log('Deposit Complete')
    //     });
    // },

    initContract: function () {
        $.getJSON("build/contracts/escrow.json", function (data) {
          let abi = data.abi;
          console.log("ABI",abi);
          let contractAddress = data.networks[App.networkId].address;
          let instance = new web3.eth.Contract(abi, contractAddress);
          console.log("Instance",instance);
          App.contracts.Escrow = { abi, contractAddress, instance };
          //App.getAllProposals();
        });
        return App.bindEvents();
      },


     addDeposit: async function (event) {
        event.preventDefault();

        let instance = App.contracts.Escrow.instance;
        //let value = $(".input-value").val();
        let value = web3.utils.toWei('10', 'ether');
        console.log(value);
        let account = await App.getAccount();
        // if (value === "") {
        //   $(".toast").toast("show");
        //   return;
        // }
        
    
        try {
          let tx = await instance.methods.deposit(account).send({ from: account ,value });
          if (tx.status) {
            // App.getAllProposals();
            // $(".input-value").val("");
          }
        } catch (e) {
          throw Error(e);
        }
     } ,

     withdraw: async function (event) {
      event.preventDefault();

      let instance = App.contracts.Escrow.instance;
      //let value = $(".input-value").val();
      let value = web3.utils.toWei('1', 'ether');
      console.log(value);
      let account = await App.getAccount();
      // if (value === "") {
      //   $(".toast").toast("show");
      //   return;
      // }
      
  
      try {
        let tx = await instance.methods.withdraw(account).send({ from: account ,value });
        if (tx.status) {
          // App.getAllProposals();
          // $(".input-value").val("");
        }
      } catch (e) {
        throw Error(e);
      }
   } ,

     getDeposits: async function(event) {
        event.preventDefault();

        let instance = App.contracts.Escrow.instance;
        //let value = $(".input-value").val();
    
        let account = await App.getAccount();
        // if (value === "") {
        //   $(".toast").toast("show");
        //   return;
        // }
    
        try {
          let tx = await instance.methods.deposits(account).call();
          console.log("depost amount",tx);
          if (tx.status) {
            // App.getAllProposals();
            // $(".input-value").val("");
          }
        } catch (e) {
          throw Error(e);
        }
     },

     btnLoading: function (elem) {
        $(elem).attr("data-original-text", $(elem).html());
        $(elem).prop("disabled", true);
        $(elem).html('<i class="spinner-border spinner-border-sm"></i> Processing...');
      },
    
      btnReset: function (elem) {
        $(elem).prop("disabled", false);
        $(elem).html($(elem).attr("data-original-text"));
      }
}

$(window).on("load", function() {
    console.log("ALSOA")
    App.load();
});