import { Card, Col, Row} from "antd";

const ActivityBar = ({tasks}) => {
    const completedCount = tasks.filter(task => task.completed).length;
    const pendingCount = tasks.filter(task => !task.completed).length;

    return (
        <div>
            <h1>TaskBoard</h1>
            <Row gutter={16}>
                <Col span={8}>
                    <Card title="Total Tasks" hoverable={true}>
                    {tasks.length}
                    </Card>
                </Col>
                <Col span={8}>
                    <Card title="Completed">
                    {completedCount}
                    </Card>
                </Col>
                <Col span={8}>
                    <Card title="Due">
                    {pendingCount}
                    </Card>
                </Col>
            </Row>
        </div>
    )
}

export default ActivityBar;