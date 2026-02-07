'use client';
import React, { useState, useEffect, use } from 'react';
import { useParams } from 'next/navigation';
import styles from './page.module.scss';
import { getProgramById, updateProgram } from '@/services/programService';
// import Button from '@/components/button';
import { useRouter } from 'next/navigation';
import { Button, Form, Input, Select, Space, Card, Typography } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import { Spin } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
const { TextArea } = Input;

const layout = {
    labelCol: { offset: 0, span: 4 },
    wrapperCol: { offset: 0, span: 16 },
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
                    <Form {...layout} form={form} name="control-hooks" onFinish={onFinish} style={{ maxWidth: 600, textAlign: 'left' }}>
                        <Form.Item name="name" label="Name" rules={[{ required: true }]} style={{ textAlign: 'left' }}>
                            <Input />
                        </Form.Item>
                        <Form.Item name="description" label="Description" rules={[{ required: true }]} style={{ textAlign: 'left' }}>
                            <TextArea rows={4} />
                        </Form.Item>
                        <Form.Item name="type" label="Type" rules={[{ required: true }]} style={{ textAlign: 'left' }}>
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


                    {/* ====================================================== */}
                    <Form
                        labelCol={{ span: 6 }}
                        wrapperCol={{ span: 18 }}
                        form={form}
                        name="dynamic_form_complex"
                        style={{ maxWidth: 600 }}
                        autoComplete="off"
                        initialValues={{ items: [{}] }}
                    >
                        <Form.List name="items">
                            {(fields, { add, remove }) => (
                                <div style={{ display: 'flex', rowGap: 16, flexDirection: 'column' }}>
                                    {fields.map((field) => (
                                        <Card
                                            size="small"
                                            title={`Item ${field.name + 1}`}
                                            key={field.key}
                                            extra={
                                                <CloseOutlined
                                                    onClick={() => {
                                                        remove(field.name);
                                                    }}
                                                />
                                            }
                                        >
                                            <Form.Item label="Name" name={[field.name, 'name']}>
                                                <Input />
                                            </Form.Item>

                                            {/* Nest Form.List */}
                                            <Form.Item label="List">
                                                <Form.List name={[field.name, 'list']}>
                                                    {(subFields, subOpt) => (
                                                        <div style={{ display: 'flex', flexDirection: 'column', rowGap: 16 }}>
                                                            {subFields.map((subField) => (
                                                                <Space key={subField.key}>
                                                                    <Form.Item noStyle name={[subField.name, 'first']}>
                                                                        <Input placeholder="first" />
                                                                    </Form.Item>
                                                                    <Form.Item noStyle name={[subField.name, 'second']}>
                                                                        <Input placeholder="second" />
                                                                    </Form.Item>
                                                                    <CloseOutlined
                                                                        onClick={() => {
                                                                            subOpt.remove(subField.name);
                                                                        }}
                                                                    />
                                                                </Space>
                                                            ))}
                                                            <Button type="dashed" onClick={() => subOpt.add()} block>
                                                                + Add Sub Item
                                                            </Button>
                                                        </div>
                                                    )}
                                                </Form.List>
                                            </Form.Item>
                                        </Card>
                                    ))}

                                    <Button type="dashed" onClick={() => add()} block>
                                        + Add Item
                                    </Button>
                                </div>
                            )}
                        </Form.List>

                        <Form.Item noStyle shouldUpdate>
                            {() => (
                                <Typography>
                                    <pre>{JSON.stringify(form.getFieldsValue(), null, 2)}</pre>
                                </Typography>
                            )}
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