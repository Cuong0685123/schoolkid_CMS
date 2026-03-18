'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import styles from './page.module.scss';
import { getProgramById, updateProgram } from '@/services/programService';
// import Button from '@/components/button';
import { useRouter } from 'next/navigation';
import { Button, Form, Input, Select, Space, Card, Typography, Upload } from 'antd';
import { CloseOutlined, UploadOutlined } from '@ant-design/icons';
import { Spin } from 'antd';
import { ArrowLeftOutlined, PlusOutlined } from '@ant-design/icons';
import { getAllProgramEducations } from '@/services/programEducationService';
const { TextArea } = Input;

const layout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 18 },
};
const tailLayout = {
    wrapperCol: { offset: 8, span: 16 },
};

export default function ProgramDetail() {
    const [formProgram] = Form.useForm();
    const [formProgramEducation] = Form.useForm();
    const router = useRouter();
    const { slug } = useParams();
    const [loading, setLoading] = useState(false);
    const [programData, setProgramData] = useState({
        name: '',
        description: '',
        type: '',
    });

    const fetchProgram = useCallback(async () => {
        setLoading(true);
        const program = await getProgramById(slug);
        console.log("program: ", program);
        setProgramData(program);

        formProgram.setFieldsValue({
            name: program.name,
            description: program.description,
            type: program.type,
        });

        formProgramEducation.setFieldsValue({
            items: program.ProgramEdus || [],
        });
        setLoading(false);
    }, [slug, formProgram, formProgramEducation]);

    const fetchProgramEducation = async () => {
        const programEducation = await getAllProgramEducations();
        console.log("programEducation: ", programEducation);
    };

    useEffect(() => {
        fetchProgram();
    }, [fetchProgram]);

    // 
    const onTypeChange = value => {
        switch (value) {
            case 'edu':
                formProgram.setFieldsValue({ type: 'edu' });
                break;
            case 'sport':
                formProgram.setFieldsValue({ type: 'sport' });
                break;
            case 'teacher':
                formProgram.setFieldsValue({ type: 'teacher' });
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
        formProgram.resetFields();
        formProgramEducation.resetFields();
    };

    const onBack = () => {
        router.back();
    };

    const normFile = (e) => {
        if (Array.isArray(e)) {
            return e;
        }
        return e?.fileList ?? [];
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
                    <Form {...layout} form={formProgram} name="control-hooks" onFinish={onFinish} style={{ maxWidth: 600, textAlign: 'left' }}>
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
                        <Form.Item wrapperCol={{ offset: 6, span: 18 }} style={{ textAlign: 'left' }}>
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
                        form={formProgramEducation}
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
                                            title={`Program ${field.name + 1}`}
                                            key={field.key}
                                            extra={
                                                <CloseOutlined
                                                    onClick={() => {
                                                        remove(field.name);
                                                    }}
                                                />
                                            }
                                        >
                                            {/* Program Title */}
                                            <Form.Item label="Title" name={[field.name, 'title']}>
                                                <Input />
                                            </Form.Item>

                                            {/* Program Detail */}
                                            <Form.Item label="Detail" name={[field.name, 'detail']}>
                                                <Input />
                                            </Form.Item>

                                            {/* Program Age Group */}
                                            <Form.Item label="Age Group" name={[field.name, 'age_group']}>
                                                <Input />
                                            </Form.Item>

                                            {/* Program Age Group */}
                                            <Form.Item label="Duration Days" name={[field.name, 'duration_days']}>
                                                <Input />
                                            </Form.Item>

                                            {/* Program Age Group */}
                                            <Form.Item label="Duration Hours" name={[field.name, 'duration_hours']}>
                                                <Input />
                                            </Form.Item>

                                            <Form.Item
                                                name={[field.name, 'thumbnail_url']}
                                                label="Upload"
                                                valuePropName="file"
                                                getValueFromEvent={normFile}
                                            >
                                                <Upload
                                                    action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
                                                    listType="picture"
                                                    maxCount={1}
                                                >
                                                    <Button icon={<UploadOutlined />}>Upload (Max: 1)</Button>
                                                </Upload>
                                            </Form.Item>

                                            <Form.Item
                                                wrapperCol={{ offset: 6, span: 18 }}
                                                style={{ textAlign: 'left' }}
                                            >
                                                <Space>
                                                    <Button htmlType="submit" color="purple" variant="solid">
                                                        Submit
                                                    </Button>
                                                </Space>
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
                                    <pre>{JSON.stringify(formProgram.getFieldsValue(), null, 2)}</pre>
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