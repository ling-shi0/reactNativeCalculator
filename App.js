import React from 'react';
import BaseLayout from './components/BaseLayout'
import { StyleSheet, View } from 'react-native';
export default function App() {
    return (
        <View style={styles.container}>
            <BaseLayout></BaseLayout>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        height: "100%",
        backgroundColor: '#eee'
    },
});
