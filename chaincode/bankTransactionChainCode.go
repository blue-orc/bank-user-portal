package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"strconv"
	"strings"

	"github.com/hyperledger/fabric/core/chaincode/shim"
	pb "github.com/hyperledger/fabric/protos/peer"
)

// AutoTraceChaincode example simple Chaincode implementation
type AutoTraceChaincode struct {
}

type BankTransaction struct {
	BankTransactionId string `json:"bankTransactionId"`
	CreatedBy    string `json:"createdBy"`      
	DateCreated  int    `json:"dateCreated"` 
	ObjectId     int    `json:"objectId"`
	ObjectType   string `json:"docType"`
	OrgName      string `json:"orgName"`
	TransactionType        int `json:"transactionType"`
	UserId   string    `json:"userId"`
	SignatureData string `json:"signatureData"`
}

// ===================================================================================
// Main
// ===================================================================================
func main() {
	err := shim.Start(new(AutoTraceChaincode))
	if err != nil {
		fmt.Printf("Error starting Parts Trace chaincode: %s", err)
	}
}

// ===================================================================================
//  init...initializes chaincode
// ===================================================================================
func (t *AutoTraceChaincode) Init(stub shim.ChaincodeStubInterface) pb.Response {
	return shim.Success(nil)
}

// ===================================================================================
// Invoke - Our entry point for Invocations
// ===================================================================================
func (t *AutoTraceChaincode) Invoke(stub shim.ChaincodeStubInterface) pb.Response {
	function, args := stub.GetFunctionAndParameters()
	fmt.Println("invoke is running " + function)

	// Handle different functions
	if function == "initBankTransaction" { //create a new vehiclePart
		return t.initBankTransaction(stub, args)
	} else if function == "readBankTransaction" { //read a vehiclePart
		return t.readBankTransaction(stub, args)
	} else if function == "queryBankTransactionByOrgName" { //find vehicle part for owner X (rich query)
		return t.queryBankTransactionByOrgName(stub, args)
	} else if function == "getBankTransactionByRange"{
		return t.getBankTransactionByRange(stub, args)
	}

	fmt.Println("invoke did not find func: " + function) //error
	return shim.Error("Received unknown function invocation")
}

// ============================================================
// initBankTransaction - create a new bank transaction, store into chaincode state
// ============================================================
func (t *AutoTraceChaincode) initBankTransaction(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	var err error

	// === Validation and Mapping ===

	if len(args) != 9 {
		return shim.Error("Incorrect number of arguments. Expecting 9")
	}
	
	createdBy := strings.ToLower(args[0])
	dateCreated, err  := strconv.Atoi(args[1])
	if err != nil {
		return shim.Error("dateCreated should be int")
	}
	objectId, err     := strconv.Atoi(args[2])
	if err != nil {
		return shim.Error("objectId should bt int")
	}
	objectType   := strings.ToLower(args[3])
	orgName      := strings.ToLower(args[4])
	transactionType, err := strconv.Atoi(args[5])
	if err != nil {
		return shim.Error("transactionType should be string")
	}
	userId := strings.ToLower(args[6])
	bankTransactionId := strings.ToLower(args[7])
	signatureData := args[8]


	BankTransaction := &BankTransaction{bankTransactionId, createdBy, dateCreated, objectId, objectType, orgName, transactionType, userId, signatureData}
	bankTransactionJSONasBytes, err := json.Marshal(BankTransaction)
	if err != nil {
		return shim.Error(err.Error())
	}

	// === Save Bank Transaction to state ===
	err = stub.PutState(bankTransactionId, bankTransactionJSONasBytes)
	if err != nil {
		return shim.Error(err.Error())
	}

	// ==== Bank Transaction saved and indexed. Return success ====
	fmt.Println("- end init bank transaction")
	return shim.Success(nil)
}


// ===============================================
// readBankTransaction - read a Bank Transaction from chaincode state
// ===============================================
func (t *AutoTraceChaincode) readBankTransaction(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	var jsonResp string
	var err error

	bankTransactionId := strings.ToLower(args[0])
	valAsbytes, err := stub.GetState(bankTransactionId) //get the bank transaction from chaincode state
	if err != nil {
		jsonResp = "{\"Error\":\"Failed to get state for " + bankTransactionId + "\"}"
		fmt.Println(jsonResp)
		return shim.Error(jsonResp)
	} else if valAsbytes == nil {
		jsonResp = "{\"Error\":\"Vehicle part does not exist: " + bankTransactionId + "\"}"
		fmt.Println(jsonResp)
		return shim.Error(jsonResp)
	}

	return shim.Success(valAsbytes)
}

// ===========================================================================================
// getBankTransactionByRange performs a range query based on the start and end keys provided.
// 
// This query system is not ideal, but is the only option currently supported by the VM.
// This will query the key value by range, currently set to epoch as by init command design.
// Start is coded to zero, current Epoch should be passed in for query of all transactions.
// ===========================================================================================
func (t *AutoTraceChaincode) getBankTransactionByRange(stub shim.ChaincodeStubInterface, args []string) pb.Response {

	if len(args) < 1 {
		return shim.Error("Incorrect number of arguments. Expecting 1")
	}

	currentEpoch := args[0]

	resultsIterator, err := stub.GetStateByRange("0", currentEpoch)
	if err != nil {
		return shim.Error(err.Error())
	}
	defer resultsIterator.Close()

	// buffer is a JSON array containing QueryResults
	var buffer bytes.Buffer
	buffer.WriteString("[")

	bArrayMemberAlreadyWritten := false
	for resultsIterator.HasNext() {
		queryResponse, err := resultsIterator.Next()
		if err != nil {
			return shim.Error(err.Error())
		}
		// Add a comma before array members, suppress it for the first array member
		if bArrayMemberAlreadyWritten == true {
			buffer.WriteString(",")
		}
		buffer.WriteString("{\"Key\":")
		buffer.WriteString("\"")
		buffer.WriteString(queryResponse.Key)
		buffer.WriteString("\"")

		buffer.WriteString(", \"Record\":")
		// Record is a JSON object, so we write as-is
		buffer.WriteString(string(queryResponse.Value))
		buffer.WriteString("}")
		bArrayMemberAlreadyWritten = true
	}
	buffer.WriteString("]")

	fmt.Printf("- getBankTransactionByRange queryResult:\n%s\n", buffer.String())

	return shim.Success(buffer.Bytes())
}

// ===== Example: Parameterized rich query =================================================
// queryBankTransactionByOrgName queries for Bank Transaction based on a passed in orgName.
// =========================================================================================
func (t *AutoTraceChaincode) queryBankTransactionByOrgName(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	if len(args) != 1 {
		return shim.Error("Incorrect number of arguments. Expecting 1")
	}

	orgName := strings.ToLower(args[0])

	queryString := fmt.Sprintf("{\"selector\":{\"orgName\":\"%s\"}}", orgName)

	queryResults, err := getQueryResultForQueryString(stub, queryString)
	if err != nil {
		return shim.Error(err.Error())
	}
	return shim.Success(queryResults)
}

// =========================================================================================
// getQueryResultForQueryString executes the passed in query string.
// Result set is built and returned as a byte array containing the JSON results.
// =========================================================================================
func getQueryResultForQueryString(stub shim.ChaincodeStubInterface, queryString string) ([]byte, error) {

	fmt.Printf("- getQueryResultForQueryString queryString:\n%s\n", queryString)

	resultsIterator, err := stub.GetQueryResult(queryString)
	if err != nil {
		return nil, err
	}
	defer resultsIterator.Close()

	// buffer is a JSON array containing QueryRecords
	var buffer bytes.Buffer
	buffer.WriteString("[")

	bArrayMemberAlreadyWritten := false
	for resultsIterator.HasNext() {
		queryResponse, err := resultsIterator.Next()
		if err != nil {
			return nil, err
		}
		// Add a comma before array members, suppress it for the first array member
		if bArrayMemberAlreadyWritten == true {
			buffer.WriteString(",")
		}
		buffer.WriteString(string(queryResponse.Value))
		bArrayMemberAlreadyWritten = true
	}
	buffer.WriteString("]")

	fmt.Printf("- getQueryResultForQueryString queryResult:\n%s\n", buffer.String())

	return buffer.Bytes(), nil
}
