import { View, FlatList, ScrollView, StyleSheet, Text, Dimensions, DeviceEventEmitter } from 'react-native'
import { DataTable, Button, Portal, Modal } from 'react-native-paper';
import { useEffect, useState } from 'react';
import getExpenseData from '../utils/getExpenseData';

export type DataType = {
    date: string,
    amount: string,
    transactionType: string,
    receiver: string
    sender: string
    description: string
}

type RowPropType = {
    item: DataType
}

const RenderRow = ({ item }: RowPropType) => {
    const [visible, setVisible] = useState(false);

    const toggleModal = () => {
        setVisible(prev => !prev);
    }

    return (
        <>
            <DataTable.Row>
                <DataTable.Cell style={styles.cell}>{item.date}</DataTable.Cell>
                <DataTable.Cell style={styles.cell}>{item.amount}</DataTable.Cell>
                <DataTable.Cell style={styles.cell}>{item.transactionType}</DataTable.Cell>
                <DataTable.Cell style={styles.cell}>
                    <Button mode='elevated' onPress={toggleModal} style={styles.modalButton}>See description</Button>
                </DataTable.Cell>
            </DataTable.Row>

            <Portal>
                <Modal visible={visible} onDismiss={toggleModal} >
                    <View style={styles.modalContent}>
                        <Text>{item.description}</Text>
                        <Button onPress={toggleModal} mode='elevated' style={{borderRadius:5}}>Close</Button>
                    </View>
                </Modal>
            </Portal>
        </>
    );
};


export default function Table({ hasPermission }: { hasPermission: boolean }) {
    const [shouldCall, setShouldCall] = useState<boolean>(false);
    const [data, setData] = useState<DataType[]>([]);

    const handlePress = async () => {
        try {
            const expenseData: DataType[] = await getExpenseData();
            setData(expenseData);
            setShouldCall(true);
        } catch (error) {
            console.error('Error fetching expense data:', error);
        }
    };
 

    useEffect(() => {
        handlePress();

        const subscription = DeviceEventEmitter.addListener('sms_onChange', () => {
            console.log('New SMS received, updating expenses...');
            handlePress();
        });

        return () => {
            subscription.remove();
        };
    }, []);

    return (
        <>
            {hasPermission && shouldCall ? (
                <ScrollView horizontal>
                    <View style={styles.tableContainer}>
                        <DataTable>
                            <DataTable.Header>
                                <DataTable.Title style={styles.headerCell}><Text style={styles.headerText}>Date</Text></DataTable.Title>
                                <DataTable.Title style={styles.headerCell}><Text style={styles.headerText}>Amount(&#x20b9;)</Text></DataTable.Title>
                                <DataTable.Title style={styles.headerCell}><Text style={styles.headerText}>Transaction Type</Text></DataTable.Title>
                                <DataTable.Title style={styles.headerCell}><Text style={styles.headerText}>Description</Text></DataTable.Title>
                            </DataTable.Header>
                            <FlatList
                                data={data}
                                renderItem={({ item }) => <RenderRow item={item} />}
                                keyExtractor={(_: DataType, index) => index.toString()}
                            />
                        </DataTable>
                    </View>
                </ScrollView>
            ) : (
                <View style={styles.container}>
                    <Button mode="elevated" onPress={handlePress}>
                    View All Expenses
                    </Button>
                </View>
            )}
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    tableContainer: {
        minWidth: Dimensions.get('window').width,
    },
    headerCell: {
        width: 130,
        justifyContent: 'center',
        paddingHorizontal: 5,
    },
    cell: {
        width: 130,
        justifyContent: 'center',
        paddingHorizontal: 5,
    },
    headerText: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'left',
    },
    modalContent: {
        padding: 20,
        backgroundColor:'#fff',
        marginHorizontal:10,
        display:'flex',
        gap:20,
        borderRadius:20
    },
    modalButton:{
        width:133,
        marginVertical:3,
        borderRadius:3
    }
});
