
import { GroupApi, GroupFormMapper, GroupValidation, type Group }     from "@/models/group";
import { useUrlParams }             from "@/utils/form/useUrlParams";
import { useForm, type IRestModel } from "@/utils/restApi";
import {GroupAddEditForm} from "@/page-components/group/GroupAddEditForm.tsx";

interface IProps extends IRestModel {
    returnUrl ?: string;
}


export default function GroupEdit( props : IProps ) {
    const params    = useUrlParams();
    const isPage    = props?.id == null;
    //if props was manually set (we have id, use props for returnUrl...else get from URL or default)
    const returnUrl = props?.id != null ? props?.returnUrl : params.get('returnUrl', '/group');
    const id        = props?.id ?? params.require('id');
    const form      = useForm<Group>(GroupApi, GroupFormMapper, GroupValidation, id, returnUrl);

    return <GroupAddEditForm form={form} isPage={isPage} />
}
