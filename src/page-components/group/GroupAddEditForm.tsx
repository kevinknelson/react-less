import type {UseFormReturn} from "@/utils/restApi/useForm.ts";
import type {Group} from "@/models/group.ts";
import {GroupConsole} from "@/page-components/group/console.tsx";
import {Form, FormInput, FormLabel, FormRangeInput} from "@/components/layout/form";
import {Button, Col, Row} from "@/components/layout/content";
import {FormSelect} from "@/components/layout/form/FormSelect.tsx";

interface IProps {
    form    : UseFormReturn<Group>
    isPage ?: boolean
}

export const GroupAddEditForm : React.FC<IProps> = (props : IProps) => {
    const { form, isPage = true } = props;
    const isAddPage               = !form.data.id;

    if (form.isLoaded) {
        return (
            <GroupConsole hideConsole={!isPage}>
                <Form onSubmit={form.handleSubmit}>
                    <Form.Header>{isAddPage ? 'Add' : 'Edit'} Group</Form.Header>
                    <Form.Body>
                        <Row margin={3}>
                            <Col xs={12} sm={3}><FormLabel htmlFor="name">Name</FormLabel></Col>
                            <Col xs={12} sm={9}>
                                <FormInput
                                    name="name"
                                    type="text"
                                    value={form.data.name}
                                    onChange={form.handleChange}
                                    onBlur={form.handleBlur}
                                    placeholder="Group name"
                                    pattern="[A-Z][a-zA-Z]*(['\s\-][a-zA-Z]+)*"
                                    required
                                />
                            </Col>
                        </Row>
                        <Row margin={3}>
                            <Col xs={12} sm={3}><FormLabel htmlFor="name">Owner</FormLabel></Col>
                            <Col xs={12} sm={9}>
                                <FormSelect
                                    name="owner"
                                    value={form.data.owner}
                                    options={[
                                        { value: 'Andrew', label: 'Andrew' },
                                        { value: 'Edson', label: 'Edson' },
                                        { value: 'Frank', label: 'Frank' },
                                        { value: 'Joe', label: 'Joe' },
                                        { value: 'Kevin', label: 'Kevin' },
                                        { value: 'Nick', label: 'Nick' },
                                        { value: 'Steve', label: 'Steve' },
                                    ]}
                                    onChange={form.handleChange}
                                />
                            </Col>
                        </Row>
                        <Row margin={3}>
                            <Col xs={12} sm={3}><FormLabel htmlFor="name">Score</FormLabel></Col>
                            <Col xs={12} sm={9}>
                                <FormRangeInput
                                    name="score"
                                    value={form.data.score ?? 50}
                                    min={0}
                                    max={100}
                                    onChange={form.handleChange}
                                    sliderText="Score"
                                />
                            </Col>
                        </Row>
                        <Row margin={3}>
                            <Col xs={12} sm={3}><FormLabel htmlFor="name">Created Date</FormLabel></Col>
                            <Col xs={12} sm={9}>
                                <FormInput
                                    name="createdDateTime"
                                    type="datetime-local"
                                    value={form.data?.createdDateTime?.toString() ?? ''}
                                    onChange={form.handleChange}
                                />
                            </Col>
                        </Row>
                    </Form.Body>
                    <Form.Actions>
                        <Button type="submit" variant="primary" disabled={form.isMutating} margin={1}>{isAddPage ? "Add Group" : "Update Group"}</Button>
                        <Button type="button" variant="secondary" onClick={form.reset} disabled={!form.isDirty || form.isMutating} margin={1}>Reset</Button>
                    </Form.Actions>
                </Form>
            </GroupConsole>
        );
    }
    return <>{form.message}</>;
}