import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import pxToDp from '../utils/PxToDp';

const data2Obj = {
    "0": "res",
    "1": "operation",
    "2": "afterRes",
    "3": "calRes"
}

export default class BaseLayout extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            res: "0",
            buttonArray: [
                "9", "8", "7", "+",
                "6", "5", "4", "-",
                "3", "2", "1", "*",
                "0", ".", "=", "/",
                "C", "退格", "暂存", "转换"
            ],
            operation: '',
            afterRes: '',
            showChangeFlag: 0,
            calRes: ''
        }
    }

    calcButton() {
        let calRes;
        switch (this.state.operation) {
            case '+': {
                calRes = "" + ((this.state.res - 0) + (this.state.afterRes - 0));
                break;
            }
            case '*': {
                calRes = "" + ((this.state.res - 0) * (this.state.afterRes - 0));
                break;
            }
            case '-': {
                calRes = "" + ((this.state.res - 0) - (this.state.afterRes - 0));
                break;
            }
            case '/': {
                calRes = "" + ((this.state.res - 0) / (this.state.afterRes - 0));
                break;
            }
        }
        this.Reset();
        this.setState({
            calRes,
            showChangeFlag: 3
        })
    }

    dealChar(buttonName) {
        if (buttonName === '=') {
            this.calcButton();
        } else if (["+", "-", "*", "/"].includes(buttonName)) {
            this.setState({
                showChangeFlag: 1,
                operation: buttonName
            })
        } else if (buttonName === 'C') {
            this.Reset();
        } else if (buttonName === '退格') {
            let temp;
            if (this.state.operation) {
                temp = this.state.afterRes;
                temp = temp.substr(0, temp.length - 1)
                if (temp === "") {
                    temp = '0'
                }
                this.setState({
                    afterRes: temp
                })
            } else {
                temp = this.state.res;
                temp = temp.substr(0, temp.length - 1)
                if (temp === "") {
                    temp = '0'
                }
                this.setState({
                    res: temp
                })
            }
        } else if (buttonName === "转换") {
            let now = data2Obj[this.state.showChangeFlag]
            let temp = this.state[now]
            temp = "" + (0 - (temp - 0));
            this.state[now] = temp;
        }
    }

    Reset() {
        this.setState({
            res: '0',
            operation: '',
            afterRes: '',
            showChangeFlag: 0
        })
    }

    onPressChange(buttonName) {
        let oldRes;
        if (!this.state.operation) {
            this.setState({
                showChangeFlag: 0
            })
            oldRes = this.state.res;
        } else {
            this.setState({
                showChangeFlag: 2
            })
            oldRes = this.state.afterRes;
        }
        if (isNaN(buttonName - 0) && buttonName !== ".") {
            this.dealChar(buttonName);
        } else {
            if ((oldRes.indexOf('.') > -1) && buttonName === ".")//判断显示字符是否有'.','.'只能显示一次
                return;
            if (oldRes[0] === '0' && buttonName !== ".") {
                oldRes = oldRes.substr(1);
            }
            if (!this.state.operation) {
                this.setState({
                    res: oldRes + buttonName
                })
            } else {
                this.setState({
                    afterRes: oldRes + buttonName
                })
            }
        }
    }

    generatePressButtons() {
        return this.state.buttonArray.map((item, index) => {
            return (
                <TouchableOpacity key={index}>
                    <View style={{ width: 85, height: 90, borderWidth: 1, borderColor: '#aaa', marginTop: 5, borderRadius: 10 }}>
                        <Text style={{ width: "100%", height: "100%", textAlign: "center", lineHeight: 90, fontSize: 30 }} onPress={() => { this.onPressChange(item) }}>{item}</Text>
                    </View>
                </TouchableOpacity>
            )
        })
    }

    render() {
        return (
            <View style={{ width: '100%' }}>
                <View style={styles.title}>
                    <Text style={styles.titleText}>优秀的计算器</Text>
                </View>
                <View style={{ height: 70, backgroundColor: 'white' }}>
                    <Text style={{ width: "100%", height: "100%", textAlign: "right", lineHeight: 70, fontSize: 30, paddingRight: 10 }}>
                        {(this.state.showChangeFlag === 0) && this.state.res}
                        {(this.state.showChangeFlag === 1) && this.state.operation}
                        {(this.state.showChangeFlag === 2) && this.state.afterRes}
                        {(this.state.showChangeFlag === 3) && this.state.calRes}
                    </Text>
                </View>
                <View style={{ width: '100%', height: 500, display: 'flex', justifyContent: "space-around", flexWrap: 'wrap', flexDirection: 'row', alignItems: "center", paddingTop: 10 }}>
                    {this.generatePressButtons()}
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    title: {
        height: pxToDp(90),
    },
    titleText: {
        fontSize: pxToDp(40),
        textAlign: "center",
        paddingTop: pxToDp(20),
        backgroundColor: "#eee",
        paddingBottom: pxToDp(20),
        fontWeight: "bold",
        color: "#32cd99"
    }
});