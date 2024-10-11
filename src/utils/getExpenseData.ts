import SmsAndroid from 'react-native-get-sms-android';
import { DataType } from '../components/Table';

export default async function getExpenseData():Promise<DataType[]> {
    return new Promise((resolve, reject) => {
        SmsAndroid.list(
            JSON.stringify({
                box: 'inbox',
                maxCount: 1000, 
            }),
            (fail: any) => {
                console.log('Failed with error: ' + fail);
                reject(fail);  
            },
            (_: any, smsList: any) => {
                const messages = JSON.parse(smsList);

                const expenseRegex = /(?:Rs|INR|₹)?\s*(\d+(?:,\d{3})*(?:\.\d{1,2})?)\s*(?=.*\b(Bank|Deposited|Credited|Debited|UPI|Received|Avl\s*Bal)\b)\s*([\w\s,]*)\s*(\b(Credited|Debited)\b)/i;


            const expenses = messages.map((message: any) => {
                const { body, date } = message;
                const match = body.match(expenseRegex);

                if (match) {
                    const amount = match[1] ? match[1].replace(/,/g, '') : null;
                    const sender = match[2] ? (match[2].trim() === 'You' ? 'You' : match[2].trim()) : 'Unknown';
                    const receiver = match[3] ? match[3].trim() : 'Unknown'; // Receiver is the name after "to"
                    const transactionType = match[4] || 'Unknown'; // Get transaction type (Credited or Debited)

                    // Push the parsed data into the expenses array
                    return {
                        amount: amount, // Cleaned amount
                        description: body, // Full SMS body for context
                        date: new Date(parseInt(date)).toLocaleDateString(), // Formatted date
                        sender: sender, // Sender, "You" or someone else
                        receiver: receiver, // Receiver (the one who got the money)
                        transactionType: transactionType // Type of transaction
                    };
                }

                return null; // Ignore messages without expense data
            }).filter((expense: any) => expense !== null);


                resolve(expenses);  
            },
        );
    });
};
