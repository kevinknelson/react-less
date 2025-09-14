import { Col, Row } from "@/components/layout/content";
import GroupEdit from "./edit";
import { GroupConsole } from "@/page-components/group/console";

export default function Test() {
    return (
        <GroupConsole>
            <Row>
                <Col><GroupEdit id={'abc'} /></Col>
                <Col><GroupEdit id={'abc'} /></Col>
            </Row>
        </GroupConsole>
    )
};

