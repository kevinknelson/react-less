import { SortableTable } from '@/components/layout/content';
import { GroupApi, type Group } from '@/models/group'
import { GroupConsole, GroupRowActions } from '@/page-components/group/console';

export default function GroupIndex() {
  const apiResponse = GroupApi.useGetAll();

  if( apiResponse?.isSuccess && apiResponse?.payload?.length == 0 ) return <p>No groups found.</p>

  const groupList = apiResponse?.payload ?? null;

    return (
        <GroupConsole>
            <SortableTable
                    caption="Groups"
                    includeRowNumber
                rowNumberLabel="#"
                rowKey="id"
                isStriped={true}
                isSticky={true}
                className='table-no-wrap'
                data={groupList}
                columns={[
                { property: 'name', label: 'Name', width:"33%", isSortable: true },
                { property: 'owner', label: 'Owner', width:"33%", isSortable: true },
                { property: 'createdDateTime', label: 'Created', width:"33%",
                    minDisplayWidth : 768,
                    isSortable      : true,
                    defaultSortDir  : 'desc',
                    sortValue       : (item : Group) => item.createdDateTime.asDate()?.getTime() ?? 0,
                    displayValue    : (item : Group) => <>{item.createdDateTime.toFormat("M/d/yyyy h:mma")}</>
                },
                { property: 'noproperty', label: 'Actions', displayValue : ( item : Group ) => GroupRowActions(item)}
                ]}
            />
        </GroupConsole>
    );
}