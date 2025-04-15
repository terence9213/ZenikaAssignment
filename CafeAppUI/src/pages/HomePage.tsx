import { Button, Col, Row } from "antd";
import { Link } from "react-router-dom";

export default function() {
    return (
        <div style={{width:500, margin:"auto"}}>
            <h1>Home Page</h1>
            <Row>
                <Col span={12}><Link to="/CafesPage"><Button>Cafes Page</Button></Link></Col>
                <Col span={12}><Link to="/EmployeesPage"><Button>Employees Page</Button></Link></Col>
            </Row>
        </div>

    );
}