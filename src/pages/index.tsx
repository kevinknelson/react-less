import { Container, Row, Col, SortableTable } from '@/components/layout/content';
import { Button } from '@/components/layout/content';
import { ProgressTracker, ProgressStep } from '@/components/layout/progress-tracker';

export default function HomePage() {
    return <Container>
        <Row>
            <Col><Button variant="primary" inputSize="sm">Primary</Button></Col>
            <Col><Button variant="secondary">Secondary</Button></Col>
            <Col><Button variant="info" inputSize="lg">Info</Button></Col>
            <Col><Button variant="success" inputSize="sm">Success</Button></Col>
            <Col><Button variant="warning">Warning</Button></Col>
            <Col><Button variant="danger" inputSize="lg">Danger</Button></Col>
            <Col><Button variant="dark" inputSize="sm">Dark</Button></Col>
            <Col><Button variant="light">Light</Button></Col>
            <Col><Button variant="link">Link</Button></Col>
        </Row>
        <Row>
            <Col>
                <SortableTable
                    caption="Sample Sortable Table"
                    includeRowNumber
                    rowNumberLabel="#"
                    rowKey="id"
                    isStriped={true}
                    isSticky={true}
                    className='table-no-wrap'
                    data={[
                        { id: 1, name: 'Alice', age: 30 },
                        { id: 2, name: 'Bob', age: 21 },
                        { id: 3, name: 'Charlie', age: 35 },
                        { id: 4, name: 'Sam', age: 33 },
                        { id: 5, name: 'Robert', age: 65 },
                        { id: 6, name: 'George', age: 89 },
                        { id: 7, name: 'Billie', age: 18 },
                        { id: 8, name: 'Susan', age: 45 },
                        { id: 9, name: 'Gregory', age: 51 },
                        { id: 10, name: 'Taylor', age: 38 },
                        { id: 11, name: 'Josh', age: 27 },
                        { id: 12, name: 'Michael', age: 19 },
                    ]}
                    columns={[
                        { property: 'name', label: 'Name', width:"50%", isSortable: true },
                        { property: 'age', label: 'Age', width:"50%", isSortable: true, defaultSortDir: 'asc' },
                    ]}
                />
            </Col>
        </Row>
        <Row>
            <Col>
                <ProgressTracker>
                    <ProgressStep status="success">Register</ProgressStep>
                    <ProgressStep status="success">Complete<br />Screening</ProgressStep>
                    <ProgressStep status="success">Choose<br />Center</ProgressStep>
                    <ProgressStep status="success">Complete<br />Medical History</ProgressStep>
                    <ProgressStep status="primary" helpText="click to continue" onClick={()=>alert("HI")}>Complete<br />Labs</ProgressStep>
                    <ProgressStep status="default">Center Will<br />Contact You</ProgressStep>
                </ProgressTracker>
            </Col>
        </Row>
    </Container>

    
}