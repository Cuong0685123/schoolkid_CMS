'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import styles from './page.module.scss';
import { createProgramEducation, deleteProgramEducation, getProgramById, updateProgram, updateProgramEducation } from '@/services/programService';
import { useRouter } from 'next/navigation';
import { Button, Form, Input, Select, Space, Card, Typography, Upload } from 'antd';
import { CloseOutlined, UploadOutlined } from '@ant-design/icons';
import { Spin } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { notification } from 'antd';
const { TextArea } = Input;

const layout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 18 },
};

// Sport Form
function SportForm({ field }) {
    return (
        <>
            <Form.Item name={[field.name, 'title']} label="Title">
                <Input />
            </Form.Item>

            <Form.Item name={[field.name, 'detail']} label="Detail">
                <Input />
            </Form.Item>

            <Form.Item
                name={[field.name, 'thumbnail_url']}
                label="Upload"
                valuePropName="file"
                getValueFromEvent={() => {}}
            >
                <Upload
                    action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
                    listType="picture"
                    maxCount={1}
                >
                    <Button icon={<UploadOutlined />}>Upload (Max: 1)</Button>
                </Upload>
            </Form.Item>
        </>
    );
}

// Education Form
function EducationForm({ field }) {
    return (
        <>
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
                getValueFromEvent={() => {}}
            >
                <Upload
                    action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
                    listType="picture"
                    maxCount={1}
                >
                    <Button icon={<UploadOutlined />}>Upload (Max: 1)</Button>
                </Upload>
            </Form.Item>
        </>
    );
}

// Teacher Form
function TeacherForm({ field }) {
    return (
        <>
            {/* Program Title */}
            <Form.Item label="Title" name={[field.name, 'full_name']}>
                <Input />
            </Form.Item>

            {/* Program Detail */}
            <Form.Item label="Detail" name={[field.name, 'role']}>
                <Input />
            </Form.Item>

            {/* Program Age Group */}
            <Form.Item label="Age Group" name={[field.name, 'bio']}>
                <Input />
            </Form.Item>

            <Form.Item
                name={[field.name, 'profile_image_url']}
                label="Upload"
                valuePropName="file"
                getValueFromEvent={() => {}}
            >
                <Upload
                    action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
                    listType="picture"
                    maxCount={1}
                >
                    <Button icon={<UploadOutlined />}>Upload (Max: 1)</Button>
                </Upload>
            </Form.Item>
        </>
    );
}


export default function ProgramDetail() {
    const [formProgram] = Form.useForm();
    const [formDynamic] = Form.useForm();
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

        setLoading(false);
    }, [slug, formProgram]);

    useEffect(() => {
        fetchProgram();
    }, [fetchProgram]);

    // change program type
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
    // submit program
    const onFinish = async values => {
        setLoading(true);
        await updateProgram(slug, values);

        setLoading(false);
        router.push(`/dashboard/program`);
    };

    // reset form
    const onReset = () => {
        formProgram.resetFields();
    };

    // back to program list
    const onBack = () => {
        router.push('/dashboard/program');
    };



    const normFile = (e) => {
        if (Array.isArray(e)) {
            return e;
        }
        return e?.fileList ?? [];
    };

    // submit program education
    const handleSubmitItem = async (index) => {
        const values = formDynamic.getFieldValue('items');
        const item = values[index];
        setLoading(true);

        if (item.id) {
            // update Education
            await updateProgramEducation(item.id, item);
            await fetchProgram();
            notification.success({
                title: 'Success',
                description: 'Program education updated successfully',
            });
        } else {
            // create Education
            const createdItem = {
                ...item,
                program_id: programData.id,
            }
            await createProgramEducation(createdItem);
            await fetchProgram();
            notification.success({
                title: 'Success',
                description: 'Program education created successfully',
            });
        }
    };

    // delete program education
    const handleDeleteItem = async (name) => {
        console.log("name: ", name);
        // const values = formProgramEducation.getFieldValue('items');
        // const item = values[index];
        // setLoading(true);
        // await deleteProgramEducation(item.id);
        // await fetchProgram();
        // notification.success({
        //     title: 'Success',
        //     description: 'Program education deleted successfully',
        // });
    }


    const fieldConfig = {
        edu: [
            { label: 'Title', name: 'title' },
            { label: 'Detail', name: 'detail' },
            { label: 'Age Group', name: 'age_group' },
            { label: 'Duration Days', name: 'duration_days' },
            { label: 'Duration Hours', name: 'duration_hours' },
            { label: 'Thumbnail', name: 'thumbnail_url' },
        ],
        sport: [
            { label: 'Title', name: 'title' },
            { label: 'Detail', name: 'detail' },
            { label: 'Image', name: 'thumbnail_url' },
        ],
        teacher: [
            { label: 'Full Name', name: 'full_name' },
            { label: 'Bio', name: 'bio' },
            { label: 'Role', name: 'role' },
            { label: 'Image', name: 'profile_image_url' },
        ],
    };

    const currentFields = fieldConfig[programData.type];
    console.log("currentFields: ", currentFields);

    useEffect(() => {
        if (!programData?.type) return;
    
        formDynamic.setFieldsValue({
            items:
                programData.type === 'edu'
                    ? programData.ProgramEdus || []
                    : programData.type === 'sport'
                    ? programData.ProgramSports || []
                    : programData.ProgramTeachers || []
        });
    }, [programData, formDynamic]);
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
                        // form={programData.type == 'edu' && formProgramEducation || programData.type == 'sport' && formProgramSport || programData.type == 'teacher' && formProgramTeacher}
                        form={formDynamic}
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
                                                    onClick={() => { handleDeleteItem(field.name); }}
                                                />
                                            }
                                        >
                                            {programData.type === 'edu' && <EducationForm field={field} />}
                                            {programData.type === 'sport' && <SportForm field={field} />}
                                            {programData.type === 'teacher' && <TeacherForm field={field} />}
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
            </div>
        </>
    );
}