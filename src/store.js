import Vue from 'vue'
import Vuex from 'vuex'
import getItem from './services/storage-service'
import transactionTypeService from './services/transactionType-service'
import blockchainService from './services/blockchain-service';

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: getItem('user'),
    bank: getItem('bank'),
    cards: getItem('cards'),
    loan: getItem('loans'),
    transactions: getItem('transactions'),
    documents: getItem('documents')
  },
  mutations: {
    async addTransaction(state, transaction){
      var result = await blockchainService.insertBankTransaction(transaction);
      if(result !== 'error'){
        if(!state.transactions || !state.transactions.length){
          state.transactions = [];
        }
        transaction.transactionTypeText = transactionTypeService(transaction.transactionType)
        state.transactions.push(transaction);
        localStorage.setItem('transactions', JSON.stringify(state.transactions))
      }
    },
    async setTransactions(state, transactions){
      state.transactions = transactions;
      for(var txn of state.transactions){
        txn.transactionTypeText = transactionTypeService(txn.transactionType)
      }
      localStorage.setItem('transactions', JSON.stringify(state.transactions))
    },
    setBank(state, bank){
      state.bank = bank;
      localStorage.setItem('bank', JSON.stringify(bank));
    },
    setCard(state, card){
      if(!state.cards || !state.cards.length){
        state.cards = [];
        state.cards.push(card);
        localStorage.setItem('cards', JSON.stringify(state.cards))
        return;
      }
      var index = state.cards.indexOf(card);
      if(index == -1){
        state.cards.push(card);
      }
      else{
        state.cards[index] = card;
      }
      localStorage.setItem('cards', JSON.stringify(state.cards));
    },
    setDocument(state, document){
      if(!state.documents || !state.documents.length){
        state.documents = [];
        state.documents.push(document);
        localStorage.setItem('documents', JSON.stringify(state.documents))
        return;
      }
      var index = state.documents.indexOf(document);
      if(index == -1){
        state.documents.push(document);
      }
      else{
        state.documents[index] = document;
      }
      localStorage.setItem('documents', JSON.stringify(state.documents));
    },
    setUser(state, user) {
      state.user = user;
      localStorage.setItem('user', JSON.stringify(user));
    }
  },
  actions: {
    signIn(state, user){
      state.commit('setUser', user);
    },
    logout(state){
      state.commit('setUser', {});
    },
    initBank(state, bank){
      state.commit('setBank', bank);
    },
    setCard(state, card){
      state.commit('setCard', card);
    },
    setDocument(state, document){
      state.commit('setDocument', document);
    },
    addTransaction(state, transaction){
      state.commit('addTransaction', transaction);
    },
    async addTransactionBlockChain(state, transaction){
      var response = await blockchainService.insertBankTransaction(transaction);
      if(response.resultCode === 'Success'){
        state.commit('addTransaction', transaction);
      }
    },
    async queryTransactionByOrgName(state, orgName){
      var response = await blockchainService.queryBankTransactionByOrgName(orgName);
      if(response.length > 0){
        state.commit('setTransactions', response);
      }
    },
    async queryAllTransactions(state){
      var response = await blockchainService.getAllBankTransactions();
      if(response.length > 0){
        state.commit('setTransactions', response);
      }
    }
  },
  getters: {
    user: state => state.user,
    bank: state => state.bank,
    cards: state => state.cards,
    documents: state => state.documents,
    transactions: state => state.transactions
  }
})
