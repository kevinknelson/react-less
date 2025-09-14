import { DropdownButton, Glyph } from "@/components/layout/content";
import { Console } from "@/components/layout/content/Console";
import type { Variant } from "@/components/layout/types/Variant";
import type { Group } from "@/models/group";

interface IProps extends React.HTMLAttributes<HTMLDivElement> {
    variant     ?: Variant;
    hideConsole ?: boolean;
}

export const GroupRowActions = ( group : Group ) => (
    <DropdownButton buttonText="Actions" variant="primary" inputSize="sm">
        <DropdownButton.Link to={`/group/edit?id=${group.id}`}><Glyph name="pencil" /> Edit Group</DropdownButton.Link>
        <DropdownButton.Link to={`/group/delete?id=${group.id}`}><Glyph name="trash" /> Delete Group</DropdownButton.Link>
    </DropdownButton>
)

const headerTabs = [
    { title: 'Edit', to: '/group/edit', activeOnly: true },
    { title: 'Delete', to: '/group/delete', activeOnly: true },
    { title: 'View All', to: '/group', end: true },
    { title: 'Test', to: '/group/test' },
    { title: 'Add', to: '/group/add' },
];

export const GroupConsole: React.FC<IProps> = (props : IProps) => {
    const { variant, hideConsole = false, children, ...rest } = props;

    return (hideConsole ? <>{children}</> :
        <Console variant={variant} {...rest}>
            <Console.Header title="Manage Groups" tabs={headerTabs}/>
            <Console.Body>
                {children}
            </Console.Body>
        </Console>
    );
};