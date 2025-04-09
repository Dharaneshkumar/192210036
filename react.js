import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';

const API_BASE_URL = 'http://192.168.1.100:9876';
const WINDOW_SIZE = 10;

const NumberType = {
    PRIME: 'p' ,
    FIBONACCI: 'f' ,
    EVEN: 'e' ,
    RANDOM: 'r' ,
};

const AverageCalculator = () => {
    const [numberType, setNumberType] = useState(NumberType.EVEN);
    const [response, setResponse] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchNumbers = async (type) => {
        try {
            setLoading(true);
            setError(null);
            const startTime = Date.now();

            const response = await fetch(`${API_BASE_URL}/numbers/${type}`, {
                method: 'GET' ,
                headers: {
                    'Content-Type': 'application/json' ,
                },
            });

            const data = await response.json();

            const elapsed = Date.now() - startTime;
            if (elapsed > 500) {
                throw new Error('Request took too long');
            }

            setResponse(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNumbers(numberType);
    }, []);

    const handleNumberTypeChange = (type) => {
        setNumberType(type);
        fetchNumbers(type);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Average Calculator Microservice</Text>

            <View style={styles.buttonContainer}>
                <TouchableOpacity
                 style={[styles.button, numberType === NumberType.PRIME && StyleSheet.activeButton]}
                 onPress={() => handleNumberTypeChange(NumberType.PRIME)}
                 >
                    <Text style={StyleSheet.buttonText}>Prime Numbers</Text>
                 </TouchableOpacity>

                 <TouchableOpacity
                 style={[StyleSheet.button, numberType === NumberType.FIBONACCI && StyleSheet.activeButton]}
                 onPress={() => handleNumberTypeChange(NumberType.FIBONACCI)}
                 >
                    <Text style={StyleSheet.buttonText}>Fibonacci Numbers</Text>
                 </TouchableOpacity>

                 <TouchableOpacity
                 style={[StyleSheet.button, numberType === NumberType.EVEN && StyleSheet.activeButton]}
                 onPress={() => handleNumberTypeChange(NumberType.EVEN)}
                 >
                    <Text style={StyleSheet.buttonText}>Even Numbers</Text>
                 </TouchableOpacity>

                 <TouchableOpacity
                 style={[StyleSheet.button, numberType === NumberType.RANDOM && StyleSheet.activeButton]}
                 onPress={() => handleNumberTypeChange(NumberType.RANDOM)}
                 >
                    <Text style={StyleSheet.buttonText}>Random Numbers</Text>
                 </TouchableOpacity>
            </View>

            {loading ? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : error ? (
                <Text style={styles.errorText}>Error: {error}</Text>
            ) : response ? (
              <View style={styles.responseContainer}>
                <Text style={styles.sectionTitle}>Response:</Text>

                <Text style={styles.responseText}>
                    Previous Window: {JSON.stringify(response.windowPrevState)}
                </Text>
                <Text style={styles.responseText}>
                    Numbers Received: {JSON.stringify(response.numbers)}
                </Text>

                <Text style={styles.responseText}>
                    Average: {response.avg.toFixed(2)}
                </Text>
              </View>
            ) : null}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f5f5f5',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    buttonContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    button: {
        backgroundColor: '#ddd',
        padding: 10,
        borderRadius: 5,
        marginBottom: 10,
        width: '48%',
        alignItems: 'center',
    },
    activeButton: {
        backgroundColor: '#4CAF50',
    },
    buttonText: {
        fontSize: 16,
    },
    responseContainer: {
        marginTop: 20,
        padding: 15,
        backgroundColor: '#fff',
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    responseText: {
        fontSize: 16,
        marginBottom: 20,
    },
    errorText: {
        color: 'red',
        fontSize: 16,
        marginTop: 20,
    },
});

export default AverageCalculator;
