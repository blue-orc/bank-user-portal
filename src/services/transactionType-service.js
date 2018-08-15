export default function convertTransactionType(key) {
    console.log(key);
    switch (key){
        case 0:
            return 'Card Requested by User'
        case 2:
            return 'Card Agreement signed by User' 
        case 10:
            return 'Credit Agreement sent'
        case 11:
            return 'Credit Card Approved'
        case 12:
            return 'Not sure?'
        default:
            return 'Unknown'
    }
}