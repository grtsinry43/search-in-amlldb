import React, { useState, useEffect, useRef } from 'react';
import { Select, Space, Table, Input, Button, Divider, Progress, message } from 'antd';

var details = [];
var matchedResults = [];
function Player() {
    // 全局通知
    const [messageApi, contextHolder] = message.useMessage();
    const success = () => {
        messageApi.open({
            type: 'success',
            content: '搜索完成',
        });
    };
    // Columns
    const columns = [
        {
            title: '歌曲图片',
            dataIndex: 's_pic',
            key: 's_pic',
        },
        {
            title: '歌曲名称',
            dataIndex: 's_name',
            key: 's_name',
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Space size="middle" key={record.s_id}>
                    <a onClick={() => handlePlayClick(record.s_id)}>播放</a>
                </Space>
            ),
        },
    ];

    // 用来接收点击事件 播放
    const handlePlayClick = (s_id) => {
        console.log('点击播放,歌曲id:', s_id);
        const matchedDetail = details.find(detail => detail.s_id === s_id);
        console.log("匹配成功:", matchedDetail);
        localStorage.setItem('amllplay', JSON.stringify(matchedDetail));
        window.dispatchEvent(new Event('playDataChanged'));
    };

    // 从 localStorage 中检索存储的字符串
    var localdata = [];
    var storedMusicDataString = localStorage.getItem('amlldata');
    if (storedMusicDataString == null || storedMusicDataString == 'null' || storedMusicDataString == '') {
        storedMusicDataString = " { \"time_ver\": \"本地无数据\" } "
        var localdata = [];
    } else {
        // 将字符串解析为数组
        const storedMusicData = JSON.parse(storedMusicDataString);
        details = storedMusicData;
        var localdata = [];
        storedMusicData.map(item => (
            // 使用map生成React元素
            localdata.push({
                key: item.s_id,
                s_pic: <img src={item.s_pic} width='40vh' />,
                s_name: item.s_name,
                s_sname: item.s_sname,
                s_id: item.s_id,
                action: item.s_id
            })
        ))
    }
    const [data, setData] = useState(localdata);
    const [searchdata, setSearchdata] = useState(localdata);
    useEffect(() => {
        const handleStorageChange = () => {
            // 当 localStorage 发生变化时，更新组件的状态
            var upddata = [];
            var storedMusicDataString = localStorage.getItem('amlldata');
            const storedMusicData = JSON.parse(storedMusicDataString);
            storedMusicData.map(item => (
                // 使用map生成React元素
                upddata.push({
                    key: item.s_id,
                    s_pic: <img src={item.s_pic} width='40vh' />,
                    s_name: item.s_name,
                    s_sname: item.s_sname,
                    s_id: item.s_id,
                    action: item.s_id
                })
            ))
            setData(upddata);
            setSearchdata(upddata);
        };
        // 添加事件监听器
        window.addEventListener('localstorageDataChanged', handleStorageChange);
        // 组件卸载时移除事件监听器
        return () => {
            window.removeEventListener('localstorageDataChanged', handleStorageChange);
        };
    }, [data]); // 空数组表示只在组件挂载和卸载时运行

    // 模糊匹配函数name
    function fuzzyMatchName(input, data) {
        const regex = new RegExp(input, 'i'); // 'i' 表示不区分大小写
        return data.filter(item => regex.test(item.s_name));//以名称搜索
    }
    // 模糊匹配函数id
    function fuzzyMatchId(input, data) {
        const regex = new RegExp(input, 'i'); // 'i' 表示不区分大小写
        return data.filter(item => regex.test(item.s_id));//以id搜索
    }

    // 定义输入框和下拉框的值的状态
    const [selectedOption, setSelectedOption] = useState('name');
    const [inputValue, setInputValue] = useState('');

    // 处理下拉框变化的回调函数
    const handleChange = (value) => {
        setSelectedOption(value);
    };

    // 处理查询按钮点击的回调函数
    const handleSearch = () => {
        // 输出输入值到控制台
        console.log('匹配模式:', selectedOption);
        console.log('搜索输入:', inputValue);
        if (selectedOption == "name") {
            console.log("现有数据:", searchdata);
            matchedResults = fuzzyMatchName(inputValue, searchdata);
            console.log("name匹配结果:", matchedResults);
            setData(matchedResults);
        } else {
            console.log("现有数据:", searchdata);
            matchedResults = fuzzyMatchId(inputValue, searchdata);
            console.log("id匹配结果:", matchedResults);
            setData(matchedResults);
        }
        // 完成
        success();
    };
    return (
        <>
            {contextHolder}
            <Space.Compact style={{ width: '100%' }}>
                <Select
                    defaultValue="name"
                    style={{
                        width: 320,
                    }}
                    onChange={handleChange}
                    options={[
                        {
                            value: 'name',
                            label: '按名称',
                        },
                        {
                            value: 'id',
                            label: '按id',
                        },
                    ]}
                />
                <Input placeholder="请在此输入要查询的歌曲id/名称,支持模糊查询" onChange={(e) => setInputValue(e.target.value)} />
                <Button type="primary" onClick={handleSearch}>查询</Button>
            </Space.Compact>
            <Divider />
            <Table columns={columns}
                dataSource={data} size='middle'
                pagination={{ pageSize: 7, showSizeChanger: false, showQuickJumper: true }}
                expandable={{
                    expandedRowRender: (record) => (
                        <p
                            style={{
                                margin: 0,
                            }}
                        >
                            歌曲id: {record.s_id}
                            <br />
                            歌手名称: {record.s_sname}
                        </p>
                    ),
                    rowExpandable: (record) => record.name !== 'Not Expandable',
                }}
            />
        </>
    );
}

export default Player;