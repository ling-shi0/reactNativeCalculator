import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import pxToDp from '../utils/PxToDp';

export default class BaseLayout extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            res: "",
            buttonArray: [
                "7", "8", "9", "+",
                "4", "5", "6", "-",
                "1", "2", "3", "x",
                "0", ".", "=", "÷",
                "C", "←", "暂存", "转换"
            ],
            lastRes: ''
        }
    }

    dealChar(buttonName) {
        if (buttonName === '=') {
            let calRes = this.state.res;
            if (calRes.indexOf("x") > -1) {
                calRes = calRes.replace("x", "*")
            }
            if (calRes.indexOf("÷") > -1) {
                calRes = calRes.replace("÷", "/")
            }
            try {
                this.setState({
                    lastRes: this.state.res,
                    res: "" + eval(calRes)
                })
            } catch (error) {
                this.setState({
                    lastRes: this.state.res,
                    res: "错误"
                })
            }
        } else if (["+", "-", "x", "÷"].includes(buttonName)) {
            let resNow = this.state.res;
            if (["+", "-", "x", "÷"].includes(resNow[resNow.length - 1])) {
                resNow = resNow.substr(0, resNow.length - 1);
                resNow += buttonName;
                this.setState({
                    res: resNow
                })
            } else {
                this.setState({
                    res: resNow + buttonName
                })
            }
        } else if (buttonName === 'C') {
            this.Reset();
        } else if (buttonName === '←') {
            let cul = this.state.res;
            if (cul) {
                cul = cul.substr(0, cul.length - 1);
                this.setState({
                    res: cul
                })
            }
        } else if (buttonName === "转换") {
            let temp = this.state.res;
            temp = "" + (0 - (temp - 0));
            this.setState({
                res: temp
            })
        } else if (buttonName === ".") {
            let oldRes = this.state.res;
            if ((oldRes.indexOf('.') > -1))//判断显示字符是否有'.','.'只能显示一次
                return;
            this.setState({
                res: oldRes + buttonName
            })
        } else if (buttonName === '暂存') {
            this.setState({
                lastRes: this.state.res
            })
        }
    }

    Reset() {
        this.setState({
            res: '',
            lastRes: ''
        })
    }

    onPressChange(buttonName) {
        if (isNaN(buttonName - 0)) {
            this.dealChar(buttonName);
        } else {
            let oldRes = this.state.res;
            if (oldRes[0] === '0' && oldRes[1] !== '.') {
                oldRes = oldRes.substr(1);
            }
            if (oldRes === "错误") {
                this.setState({
                    res: buttonName
                })
                return;
            }
            this.setState({
                res: oldRes + buttonName
            })
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
                    <Text style={styles.titleText}>{this.state.lastRes}</Text>
                </View>
                <View style={{ height: 70, backgroundColor: 'white' }}>
                    <Text style={{ width: "100%", height: "100%", textAlign: "right", lineHeight: 70, fontSize: 50, paddingRight: 10 }}>
                        {this.state.res}
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
        backgroundColor: 'white'
    },
    titleText: {
        fontSize: pxToDp(40),
        textAlign: "right",
        paddingTop: pxToDp(20),
        backgroundColor: 'white',
        paddingBottom: pxToDp(20),
        fontWeight: "bold",
        paddingRight: 10,
        color: "rgba(150, 150, 150, 1)"
    }
});