'use client';
import React, { useState, useEffect, use } from 'react';
import { useParams } from 'next/navigation';
import styles from './page.module.scss';
import { getProgramById, updateProgram } from '@/services/programService';
// import Button from '@/components/button';
import { useRouter } from 'next/navigation';
import { Button, Form, Input, Select, Space } from 'antd';
const { TextArea } = Input;
import { Spin } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';

const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
};
const tailLayout = {
    wrapperCol: { offset: 8, span: 16 },
};

export default function ProgramDetail() {
    const router = useRouter();
    const { slug } = useParams();
    const [loading, setLoading] = useState(false);
    const [programData, setProgramData] = useState({
        name: '',
        description: '',
        type: '',
    });

    const fetchProgram = async () => {
        setLoading(true);
        const program = await getProgramById(slug);
        console.log("program: ", program);
        setProgramData(program);

        form.setFieldsValue({
            name: program.name,
            description: program.description,
            type: program.type,
        });
        setLoading(false);
    };

    useEffect(() => {
        fetchProgram();
    }, [slug]);

    // 
    const [form] = Form.useForm();
    const onTypeChange = value => {
        switch (value) {
            case 'edu':
                form.setFieldsValue({ type: 'edu' });
                break;
            case 'sport':
                form.setFieldsValue({ type: 'sport' });
                break;
            case 'teacher':
                form.setFieldsValue({ type: 'teacher' });
                break;
            default:
        }
    };
    const onFinish = async values => {
        setLoading(true);
        await updateProgram(slug, values);

        setLoading(false);
        router.push(`/dashboard/program`);
    };
    const onReset = () => {
        form.resetFields();
    };

    const onBack = () => {
        router.back();
    };

    return (
        <>

            {loading && <Spin fullscreen />}
            <div className="dashboard">
                <div className={"dashboard-header"}>
                    <Button icon={<ArrowLeftOutlined />} htmlType="button" onClick={onBack} color="purple" variant="outlined">
                        Back
                    </Button>
                    <h1 className="title">{programData?.name ?? ""}</h1>
                </div>
                <div className={styles.formContainer}>
                    <Form {...layout} form={form} name="control-hooks" onFinish={onFinish} style={{ maxWidth: 600 }}>
                        <Form.Item name="name" label="Name" rules={[{ required: true }]}>
                            <Input />
                        </Form.Item>
                        <Form.Item name="description" label="Description" rules={[{ required: true }]}>
                            <TextArea rows={4} />
                        </Form.Item>
                        <Form.Item name="type" label="Type" rules={[{ required: true }]}>
                            <Select
                                allowClear
                                placeholder="Select a type"
                                onChange={onTypeChange}
                                options={[
                                    { label: 'edu', value: 'edu' },
                                    { label: 'sport', value: 'sport' },
                                    { label: 'teacher', value: 'teacher' },
                                ]}
                            />
                        </Form.Item>
                        <Form.Item noStyle shouldUpdate={(prevValues, currentValues) => prevValues.type !== currentValues.type} >
                            {({ getFieldValue }) =>
                                getFieldValue('type') === 'other' ? (
                                    <Form.Item name="customizeGender" label="Customize Gender" rules={[{ required: true }]}>
                                        <Input />
                                    </Form.Item>
                                ) : null
                            }
                        </Form.Item>
                        <Form.Item {...tailLayout}>
                            <Space>
                                <Button htmlType="submit" color="purple" variant="solid">
                                    Submit
                                </Button>
                                <Button htmlType="button" onClick={onReset} color="purple" variant="outlined">
                                    Reset
                                </Button>
                            </Space>
                        </Form.Item>
                    </Form>
                </div>

                {/* CTA */}
                {/* <div className={styles.ctaContainer}>
                <button className={styles.ctaSave}>save</button>
            </div> */}
            </div>
        </>
    );
}