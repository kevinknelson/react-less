import { Col, Row, Button, ButtonLink } from "@/components/layout/content";
import { Form } from "@/components/layout/form/Form";
import { GroupApi }     from "@/models/group";
import { GroupConsole } from "@/page-components/group/console";
import { useUrlParams }             from "@/utils/form/useUrlParams";
import { type IRestModel } from "@/utils/restApi";
import { useNavigate } from "react-router-dom";

interface IProps extends IRestModel {
    returnUrl ?: string;
}


export default function GroupEdit( props : IProps ) {
    const navigate          = useNavigate();
    const params            = useUrlParams();
    const id                = props?.id ?? params.require('id');
    const group             = GroupApi.useGetById(id);
    const { submit: deleteGroup, isMutating } = GroupApi.useDelete(id);

    const defaultReturnUrl  = `/group`;
    const returnUrl         = (props?.returnUrl ?? params.get('returnUrl', null)) ?? defaultReturnUrl;

    const handleDelete = async (e: React.FormEvent) => {
        e.preventDefault();
        const response = await deleteGroup();
        if (response?.isSuccess) {
            navigate(returnUrl);
        } else {
            console.error("Failed to delete group", response?.message);
        }
    };

    if( group?.payload != null ) {
        return (
            <GroupConsole>
                <Form onSubmit={handleDelete}>
                    <Form.Header>Delete Group</Form.Header>
                    <Form.Body>
                        <Row margin={3}>
                            <Col>
                                <h2 className='text-center'>Are you sure you wish to delete the group: <strong>{group.payload.name}</strong>?</h2>
                            </Col>
                        </Row>
                    </Form.Body>
                    <Form.Actions>
                        <Button type="submit" variant="danger" disabled={isMutating} margin={1}>Confirm Delete</Button>
                        <ButtonLink variant="secondary" to={returnUrl}>Cancel</ButtonLink>
                    </Form.Actions>
                </Form>
            </GroupConsole>
        );
    }
    return <>{group?.message ?? "Loading..."}</>;
}
