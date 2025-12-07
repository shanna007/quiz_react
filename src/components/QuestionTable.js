import { Space, Table, message, Modal, Form, Input, Button, Select } from 'antd';
import React, { useState, useEffect } from 'react';

const { TextArea } = Input;
const { Option } = Select;

const FormContainer = {
  padding: '20px',
  borderRadius: '8px',
  background: '#fff',
  boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
};


const mockQuestionData = [
    {
        key: '1',
        id: '1',
        question: '你最喜欢的核心入口函数是？',
        options: ['A. setup()', 'B. created()', 'C. mounted()', 'D. watch()'],
        answer: 'A'
    },
    {
        key: '2',
        id: '2',
        question: 'TypeScript中定义“可以为字符串或数字”的类型是？',
        options: ['A. string | number', 'B. any', 'C. union', 'D. unknown'],
        answer: 'A'
    },
    {
        key: '3',
        id: '3',
        question: '浏览器本地存储中，localStorage的存储时效是？',
        options: ['A. 永久存储（除非手动清除）', 'B. 会话结束后失效', 'C. 7天自动过期', 'D. 30天自动过期'],
        answer: 'A'
    },
    {
        key: '4',
        id: '4',
        question: '以下哪种方式可以解决前端跨域问题？',
        options: ['A. CORS', 'B. 防抖', 'C. 节流', 'D. 闭包'],
        answer: 'A'
    },
    {
        key: '5',
        id: '5',
        question: 'JavaScript中，数组的map方法返回值是？',
        options: ['A. 新数组', 'B. 原数组', 'C. 布尔值', 'D. 数字'],
        answer: 'A'
    },
    {
        key: '6',
        id: '6',
        question: 'CSS中实现元素水平垂直居中的方式不包括？',
        options: ['A. float: center', 'B. flex布局', 'C. position + transform', 'D. grid布局'],
        answer: 'A'
    },
    {
        key: '7',
        id: '7',
        question: 'HTTP请求方法中，用于获取资源的是？',
        options: ['A. GET', 'B. POST', 'C. PUT', 'D. DELETE'],
        answer: 'A'
    },
    {
        key: '8',
        id: '8',
        question: '前端性能优化中，“图片懒加载”的核心目的是？',
        options: ['A. 减少首屏加载资源', 'B. 提升图片清晰度', 'C. 加快图片上传速度', 'D. 降低服务器压力'],
        answer: 'A'
    },
    {
        key: '9',
        id: '9',
        question: 'Git中撤销工作区修改的命令是？',
        options: ['A. git checkout -- <文件>', 'B. git reset', 'C. git revert', 'D. git pull'],
        answer: 'A'
    },
    {
        key: '10',
        id: '10',
        question: 'React中，函数组件接收父组件传值的方式是？',
        options: ['A. props参数', 'B. state状态', 'C. context上下文', 'D. ref属性'],
        answer: 'A'
    },
    {
        key: '11',
        id: '11',
        question: 'Vue3中响应式数据的核心API是？',
        options: ['A. ref()', 'B. reactive()', 'C. computed()', 'D. provide()'],
        answer: 'B'
    },
    {
        key: '12',
        id: '12',
        question: 'JavaScript中Promise的状态不包括？',
        options: ['A. pending', 'B. resolved', 'C. running', 'D. rejected'],
        answer: 'C'
    },
    {
        key: '13',
        id: '13',
        question: 'CSS3中实现动画的属性是？',
        options: ['A. animation', 'B. transition', 'C. transform', 'D. translate'],
        answer: 'A'
    },
    {
        key: '14',
        id: '14',
        question: 'HTTP状态码中表示“未找到资源”的是？',
        options: ['A. 404', 'B. 500', 'C. 401', 'D. 403'],
        answer: 'A'
    },
    {
        key: '15',
        id: '15',
        question: 'Git中合并分支的命令是？',
        options: ['A. git merge', 'B. git rebase', 'C. git pull', 'D. git push'],
        answer: 'A'
    }
];

const QuestionTab = ({ searchKeyword, refreshFlag }) => {
    const [data, setData] = useState([]);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 5,
        total: mockQuestionData.length,
        showSizeChanger: false,
        placement: 'bottomLeft',
    });
    const [loading, setLoading] = useState(false);
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [editingQuestion, setEditingQuestion] = useState(null);
    const [form] = Form.useForm();

    const columns = [
        {
            title: '序号',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: '题目',
            dataIndex: 'question',
            key: 'question',
            render: (text) => <a>{text}</a>,
        },
        {
            title: '选项',
            dataIndex: 'options',
            key: 'options',
            render: (options) => options.join(', ')
        },
        {
            title: '答案',
            dataIndex: 'answer',
            key: 'answer',
        },
        {
            title: '操作',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <Button type="primary" onClick={() => handleEdit(record)}>编辑</Button>
                    <Button type="primary" danger onClick={() => handleDelete(record)}>删除</Button>
                </Space>
            ),
        },
    ];

    const fetchData = (page = 1, pageSize = 5, keyword = '') => {
        setLoading(true);
     
        setTimeout(() => {
            let filteredData = [...mockQuestionData];
            if (keyword && keyword.trim() !== '') {
                filteredData = mockQuestionData.filter(question => 
                    question.question.toLowerCase().includes(keyword.toLowerCase())
                );
            }
    
            const start = (page - 1) * pageSize;
            const end = start + pageSize;
            const paginatedData = filteredData.slice(start, end);
            
            setData(paginatedData);
            setPagination({
                ...pagination,
                current: page,
                pageSize: pageSize,
                total: filteredData.length,
            });
            setLoading(false);
        }, 300); 
    };

    const handleEdit = (record) => {
        console.log('编辑题目:', record);
        setEditingQuestion(record);
        // 解析所有四个选项（A/B/C/D）
        form.setFieldsValue({
            question: record.question,
            optionA: record.options[0]?.replace('A. ', '') || '',
            optionB: record.options[1]?.replace('B. ', '') || '',
            optionC: record.options[2]?.replace('C. ', '') || '',
            optionD: record.options[3]?.replace('D. ', '') || '',
            answer: record.answer
        });
        setEditModalVisible(true);
    };

    const handleEditSave = async () => {
        try {
            const values = await form.validateFields();
            console.log('编辑表单值:', values);
            
            message.success(`已更新题目：${values.question}`);
            setEditModalVisible(false);
            fetchData(pagination.current, pagination.pageSize, searchKeyword);
        } catch (error) {
            console.error('表单验证失败:', error);
        }
    };

    const handleDelete = (record) => {
        Modal.confirm({
            title: '确认删除',
            content: `确定要删除题目 "${record.question}" `,
            okText: '确定',
            cancelText: '取消',
            onOk: () => {
                message.success(`已删除题目：${record.question}（演示模式）`);
            }
        });
    };

    const handleTableChange = (pag) => {
        console.log('页码变化:', pag);
        fetchData(pag.current, pag.pageSize, searchKeyword);
    };

    useEffect(() => {
        fetchData(pagination.current, pagination.pageSize, searchKeyword);
    }, [searchKeyword, refreshFlag]);

    return (
        <>
            <style>{`
                .ant-pagination-item {
                    margin-right: 3px !important;
                    margin-left: 3px !important;
                }
                .ant-pagination-prev,
                .ant-pagination-next {
                    margin-right: 3px !important;
                    margin-left: 3px !important;
                }
                .ant-table-wrapper .ant-table-pagination.ant-pagination {
                    justify-content: flex-start !important;
                }
            `}</style>
            
            <Table
                columns={columns}
                dataSource={data}
                pagination={pagination}
                loading={loading}
                onChange={handleTableChange}
                rowKey="id"
                bordered
                size="middle"
            />

            <Modal
                title="编辑题目"
                open={editModalVisible}
                onCancel={() => setEditModalVisible(false)}
                okText="保存"
                cancelText="取消"
                width={600}
                footer={null}
                onOk={handleEditSave}
            >
                <div style={FormContainer}>
                    <Form
                        form={form}
                        layout="vertical"
                        size="middle"
                        style={{ marginTop: '10px' }}
                    >
                        <Form.Item
                            name="question"
                            label="题目内容"
                            rules={[{ message: '请输入题目内容' }]}
                            style={{ marginBottom: '16px' }}
                        >
                            <TextArea 
                                rows={3} 
                                placeholder="请输入题目内容" 
                                style={{ 
                                    borderRadius: '6px', 
                                    borderColor: '#e8e8e8',
                                    resize: 'none',
                                    minHeight: '84px',
                                    maxHeight: '84px',
                                    width: '100%'
                                }} 
                            />
                        </Form.Item>

                        <Form.Item
                            name="optionA"
                            label="选项A"
                            style={{ marginBottom: '16px' }} 
                        >
                            <Input 
                                placeholder="选项A" 
                                style={{ borderRadius: '6px', borderColor: '#e8e8e8', width: '100%' }}
                            />
                        </Form.Item>
                        
                        <Form.Item
                            name="optionB"
                            label="选项B"
                            style={{ marginBottom: '16px' }}
                        >
                            <Input 
                                placeholder="选项B" 
                                style={{ borderRadius: '6px', borderColor: '#e8e8e8', width: '100%' }}
                            />
                        </Form.Item>

                        <Form.Item
                            name="optionC"
                            label="选项C"
                            style={{ marginBottom: '16px' }}
                        >
                            <Input 
                                placeholder="选项C" 
                                style={{ borderRadius: '6px', borderColor: '#e8e8e8', width: '100%' }}
                            />
                        </Form.Item>
                        
                        <Form.Item
                            name="optionD"
                            label="选项D"
                            style={{ marginBottom: '20px' }}
                        >
                            <Input 
                                placeholder="选项D" 
                                style={{ borderRadius: '6px', borderColor: '#e8e8e8', width: '100%' }}
                            />
                        </Form.Item>

                        <Form.Item
                            name="answer"
                            label="正确答案"
                            rules={[{ message: '请输入正确答案' }]}
                            style={{ marginBottom: '20px' }}
                        >
                            <Input 
                                placeholder="请输入正确答案（如：A/B/C/D）" 
                                style={{ borderRadius: '6px', borderColor: '#e8e8e8', width: '100%' }}
                            />
                        </Form.Item>

                        <Form.Item>
                            <div style={{ 
                                display: 'flex', 
                                justifyContent: 'center',
                                gap: '12px',
                                marginTop: '10px'
                            }}>
                                <Button 
                                    onClick={() => setEditModalVisible(false)}
                                    type="default" 
                                    ghost
                                    style={{ 
                                        padding: '0 20px',
                                        borderRadius: '6px',
                                    }}
                                >
                                    取消
                                </Button>
                                <Button 
                                    type="primary" 
                                    onClick={handleEditSave}
                                    style={{ 
                                        padding: '0 24px',
                                        borderRadius: '6px',
                                        backgroundColor: '#1890ff',
                                        borderColor: '#1890ff',
                                    }}
                                >
                                    保存
                                </Button>
                            </div>
                        </Form.Item>
                    </Form>
                </div>
            </Modal>
        </>
    );
};

export default QuestionTab;