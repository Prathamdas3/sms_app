import SmsAndroid from 'react-native-get-sms-android';
import { DataType } from '../components/Table';


const expenseRegex = /(?:Rs|INR|₹)?\s*(\d+(?:,\d{3})*(?:\.\d{1,2})?)\s*(?=.*\b(Bank|Deposited|Credited|Debited|UPI|Received|Avl\s*Bal)\b)\s*([\w\s,]*)\s*(\b(Credited|Debited)\b)/i;


export default async function getExpenseData(): Promise<DataType[]> {
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

                const expenses = messages.map((message: any) => {
                    const { body, date } = message;
                    const match = body.match(expenseRegex);
                   

                    if (match) {
                        const amount = match[1] ? match[1].replace(/,/g, '') : null;
                        const transactionType: string = match[4] || 'Unknown';


                        return {
                            amount: amount,
                            description: body,
                            date: new Date(parseInt(date)).toLocaleDateString(),
                            transactionType: transactionType.slice(0, 1).toUpperCase() + transactionType.slice(1, transactionType.length)
                        };
                    }

                    return null; 
                }).filter((expense: any) => expense !== null);

                resolve(expenses);
            },
        );
    });
};
