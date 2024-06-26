import React, { useState, useEffect, useRef } from 'react';
import { Select, Space, Table, Input, Button, Drawer, Card, Divider, Progress, message } from 'antd';
import { WarningTwoTone } from '@ant-design/icons';

var details = [];
var matchedResults = [];
function Search() {
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
            title: '歌手',
            dataIndex: 's_sname',
            key: 's_sname',
        },
        {
            title: '歌曲id',
            dataIndex: 's_id',
            key: 's_id',
        },
        {
            title: '歌词创建者',
            dataIndex: 'ttml_create',
            key: 'ttml_create',
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Space size="middle" key={record.s_id}>
                    <a onClick={() => handleDetailClick(record.s_id)}>详情</a>
                    <a onClick={() => handlePlayClick(record.s_id)}>播放</a>
                </Space>
            ),
        },
    ];

    // 新建一个Drawer
    const [open, setOpen] = useState(false);
    const [drawerinfo, setDrawerinfo] = useState("无信息");
    const showDrawer = () => {
        setOpen(true);
    };
    const onClose = () => {
        setOpen(false);
        pauseAudio();
    };

    // Mute Audio
    const audioRef = useRef(null);
    const pauseAudio = () => {
        if (audioRef.current) {
            audioRef.current.pause();
        }
    };

    const [contentList, setContentlist] = useState({
        tab1: <p key="tab1">无信息 tab1</p>,
        tab2: <p key="tab2">无信息 tab2</p>,
        tab3: <p key="tab3">无信息 tab3</p>,
    });
    // 资源下载列表Tabs
    const tabList = [
        {
            key: 'tab1',
            tab: '歌曲资源',
        },
        {
            key: 'tab2',
            tab: 'TTML歌词资源',
        },
        {
            key: 'tab3',
            tab: '其他资源',
        },
    ];
    const [activeTabKey1, setActiveTabKey1] = useState('tab1');
    // Tabs
    const onTab1Change = (key) => {
        setActiveTabKey1(key);
    };

    // 用来接收点击事件
    const handleDetailClick = (s_id) => {
        console.log('点击详情,歌曲id:', s_id);
        const matchedDetail = details.find(detail => detail.s_id === s_id);
        console.log("匹配成功:", matchedDetail);
        setDrawerinfo([
            <p key={matchedDetail.s_pic}><img src={matchedDetail.s_pic} width="80vh" /></p>,
            <p key={matchedDetail.s_id}>歌曲id:{matchedDetail.s_id}</p>,
            <p key={matchedDetail.s_name}>歌曲名称:{matchedDetail.s_name}</p>,
            <p key={matchedDetail.s_sname}>歌手名称:{matchedDetail.s_sname}</p>,
            <p key={matchedDetail.s_downurl}><audio src={matchedDetail.s_downurl} ref={audioRef} controls /></p>,
        ])
        setContentlist(
            {
                tab1: <p key="tab1"><WarningTwoTone twoToneColor="#eb2f96" />
                    &nbsp;仅供歌词制作使用,请勿用作非法用途
                    <br /><br />
                    <a href={matchedDetail.s_downurl} target='_blank'>歌曲文件下载</a>
                </p>,
                tab2: <p key="tab2"><WarningTwoTone twoToneColor="#eb2f96" />
                    &nbsp;仅供歌词制作使用,请勿用作非法用途
                    <br /><br />
                    <a href={matchedDetail.ttml_downurl} target='_blank'>TTML文件下载</a>
                    <br />
                    <a href={matchedDetail.ttml_url} target='_blank'>Github歌词文件页面</a>
                </p>,
                tab3: <p key="tab3"><WarningTwoTone twoToneColor="#eb2f96" />
                    &nbsp;仅供歌词制作使用,请勿用作非法用途
                    <br /><br />
                    <a href={"https://music.163.com/#/song?id=" + matchedDetail.s_id} target='_blank'>网易云歌曲详情页面</a>
                </p>,
            }
        );
        showDrawer();
    };

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
        storedMusicData.map(item => {
            // 使用map生成React元素
            var infos = " 未能成功匹配文件更改信息 /";
            var infos2 = "未能成功匹配";
            if (item.ttml_info.length != 0) {
                var w = 0;
                while (true) {
                    if( w == 0 ){
                        infos = "";
                    }
                    infos = infos + " " + item.ttml_info[w].ttml_ver + " " + item.ttml_info[w].ttml_author + " / ";
                    if (w + 1 == item.ttml_info.length) {
                        infos2 = item.ttml_info[w].ttml_author;
                    }
                    if (w + 1 == item.ttml_info.length) {
                        break;
                    }
                    w++;
                }
            }
            
            localdata.push({
                key: item.s_id,
                s_pic: <img src={item.s_pic} width='40vh' />,
                s_name: item.s_name,
                s_sname: item.s_sname,
                s_id: item.s_id,
                action: item.s_id,
                ttml_info: infos,
                ttml_create: infos2
            })
        })
    }
    const [data, setData] = useState(localdata);
    const [searchdata, setSearchdata] = useState(localdata);
    useEffect(() => {
        const handleStorageChange = () => {
            // 当 localStorage 发生变化时，更新组件的状态
            var upddata = [];
            var storedMusicDataString = localStorage.getItem('amlldata');
            const storedMusicData = JSON.parse(storedMusicDataString);
            storedMusicData.map(item => {
                // 使用map生成React元素
                var infos = " 未能成功匹配文件更改信息 /";
                var infos2 = "未能成功匹配";
                if (item.ttml_info.length != 0) {
                    var w = 0;
                    while (true) {
                        if( w == 0 ){
                            infos = "";
                        }
                        infos = infos + " " + item.ttml_info[w].ttml_ver + " " + item.ttml_info[w].ttml_author + " / ";
                        if (w + 1 == item.ttml_info.length) {
                            infos2 = item.ttml_info[w].ttml_author;
                        }
                        if (w + 1 == item.ttml_info.length) {
                            break;
                        }
                        w++;
                    }
                }
                upddata.push({
                    key: item.s_id,
                    s_pic: <img src={item.s_pic} width='40vh' />,
                    s_name: item.s_name,
                    s_sname: item.s_sname,
                    s_id: item.s_id,
                    action: item.s_id,
                    ttml_info: infos,
                    ttml_create: infos2
                })
            })
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

    // Progress + buttonDisabled
    const [progressVisible, setProgressVisible] = useState(true);
    const [progressPercent, setProgressPercent] = useState(0);
    const [progressHint, setProgressHint] = useState("等待查询");
    const [button_disabled, setButtondisabled] = useState(false);

    // 处理查询按钮点击的回调函数
    const handleSearch = () => {
        //禁用button
        setButtondisabled(true);
        // Progress
        //setProgressVisible(true);
        setProgressPercent(10);
        setProgressHint("匹配输入");
        // 输出输入值到控制台
        console.log('匹配模式:', selectedOption);
        console.log('搜索输入:', inputValue);
        if (selectedOption == "name") {
            setProgressPercent(50);
            setProgressHint("匹配数据");
            console.log("现有数据:", searchdata);
            matchedResults = fuzzyMatchName(inputValue, searchdata);
            console.log("name匹配结果:", matchedResults);
            setProgressPercent(80);
            setProgressHint("更新视图");
            setData(matchedResults);
        } else {
            setProgressPercent(50);
            setProgressHint("匹配数据");
            console.log("现有数据:", searchdata);
            matchedResults = fuzzyMatchId(inputValue, searchdata);
            console.log("id匹配结果:", matchedResults);
            setProgressPercent(80);
            setProgressHint("更新视图");
            setData(matchedResults);
        }
        // 完成
        setProgressPercent(100);
        setProgressHint("查询完成");
        //setProgressVisible(false);
        setButtondisabled(false);
        success();
        function initProgress() {
            setProgressPercent(0);
            setProgressHint("等待查询");
            console.log("重置Progress显示")
        }
        setTimeout(initProgress, 3000);
    };
    return (
        <>
            {contextHolder}
            <Space.Compact style={{ width: '50%' }}>
                <Select
                    defaultValue="name"
                    style={{
                        width: 320,
                    }}
                    onChange={handleChange}
                    options={[
                        {
                            value: 'name',
                            label: '按歌曲名称查询',
                        },
                        {
                            value: 'id',
                            label: '按歌曲id查询',
                        },
                    ]}
                />
                <Input placeholder="请在此输入要查询的歌曲id/名称,支持模糊查询" onChange={(e) => setInputValue(e.target.value)} />
                <Button type="primary" onClick={handleSearch} disabled={button_disabled}>查询</Button>
                {progressVisible && (
                    <Button type="text">
                        <Progress
                            type="circle"
                            trailColor="#e6f4ff"
                            percent={progressPercent}
                            strokeWidth={20}
                            size={14}
                            format={(number) => `进行中，已完成${number}%`}
                        />
                        <span
                            style={{
                                marginLeft: 8,
                            }}
                        >
                            {progressHint}
                        </span>
                    </Button>
                )}
            </Space.Compact>
            <Divider />
            <Table columns={columns}
                dataSource={data}
                size='middle'
                pagination={{ pageSize: 7, showSizeChanger: false, showQuickJumper: true }}
                expandable={{
                    expandedRowRender: (record) => (
                        <p
                            style={{
                                margin: 0,
                            }}
                        >
                            更改记录: /{record.ttml_info}
                        </p>
                    ),
                    rowExpandable: (record) => record.name !== 'Not Expandable',
                }}
            />
            <Drawer title="歌曲详情" placement="right" onClose={onClose} open={open}>
                {drawerinfo}
                <Card style={{ width: '100%', }} title="相关资源下载" tabList={tabList} activeTabKey={activeTabKey1} onTabChange={onTab1Change} tabProps={{ size: 'middle', }} hoverable={true}>{contentList[activeTabKey1]}</Card>
            </Drawer>
        </>
    );
}

export default Search;