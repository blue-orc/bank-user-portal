import axios from 'axios'

//var baseUri = 'https://e8d0455bbefd44b291f8080a4fade098.blockchain.ocp.oraclecloud.com/restproxy2/bcsgw/rest/v1/transaction/invocation'
var baseUri = 'http://localhost:3500/';

var auth = {
    username: 'bhanujanagore@gmail.com',
    password: 'Bestluck@1309'
}


var config ={
    //auth: auth
    //headers: headers
}

var blockchainErrorsToConsole = function(response){
    for(var i = 0; i < response.data.info.peerErrors.length; i++){
        console.log(response.data);
    }
}

export default {
    async insertBankTransaction(transaction) {
        transaction.orgName = transaction.orgName.toLowerCase();
        if(!transaction.signatureData){
            transaction.signatureData = '';
        }
        var uri = baseUri;
        var milliseconds = (new Date).getTime();       
        var body = {
            channel: "bankoforacleorderer",
            chaincode: "bankTransaction",
            method: "initBankTransaction",
            args: [
                transaction.userId, 
                transaction.dateCreated, 
                transaction.objectId, 
                transaction.objectType,
                transaction.orgName, 
                transaction.transactionType, 
                transaction.userId, 
                milliseconds.toString(),
                transaction.signatureData
            ],
            chaincodeVer: "v7"
        }

        try {
            var response = await axios.post(uri + 'insertBankTransaction', body, config);
            if(response.data.returnCode !== 'Success'){
                blockchainErrorsToConsole(response);
            }
            console.log(response.data)
            return transaction;
        } catch (error) {
            console.log(error);
            return 'error';
        }
    },
    async queryBankTransactionByOrgName(orgName) {
        var uri = baseUri

        var body = {
            channel: "bank1channel",
            chaincode: "customer_1",
            method: "queryBankTransactionByOrgName",
            args: [orgName],
            chaincodeVer: "v28"
        }

        try {
            var response = await axios.post(uri, body);
            if(response.data.returnCode !== 'Success'){
                blockchainErrorsToConsole(response);
            }
            return response.data.result.payload;
        } catch (error) {
            console.log(error);
            return '';
        }
    },
    async getAllBankTransactions() {
        var uri = baseUri
        var milliseconds = (new Date).getTime();

        var body = {
            channel: "bankoforacleorderer",
            chaincode: "bankTransaction",
            method: "getBankTransactionByRange",
            args: [milliseconds.toString()],
            chaincodeVer: "v7"
        }

        try {
            var response = await axios.post(uri + 'getAllBankTransaction', body);
            if(response.data.returnCode !== 'Success'){
                blockchainErrorsToConsole(response);
            }
            var payload = response.data.result.payload;
            var results = JSON.parse(payload);
            var transactions = []
            for(var result of results){
                transactions.push(result.Record);
            }
            console.log(transactions);
            return transactions;
        } catch (error) {
            console.log(error);
            return 'error';
        }
    }
}
