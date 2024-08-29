import  { useState } from "react";
import { Form, FormGroup, Label, Input, FormText, Button } from 'reactstrap';
import register_user from "../../api/user_api";  // Make sure the path is correct

const Register: React.FC = () => {
    // State to manage form inputs
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [dob, setDob] = useState('');
    const [phone_number, setPhoneNumber] = useState('');

    // Function to handle form submission
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            // Call the register_user function with form data
            await register_user(name, email, password, new Date(dob), phone_number);
        } catch (error) {
            console.log('Error registering user:', error);
        }
    };

    return (
        <>
        <div>
            <Form onSubmit={handleSubmit}>
                <FormGroup>
                    <Label for="name">Name</Label>
                    <Input 
                        id="name" 
                        value={name} 
                        onChange={(e) => setName(e.target.value)} 
                    />
                    <FormText>Your full name.</FormText>
                </FormGroup>

                <FormGroup>
                    <Label for="email">Email</Label>
                    <Input 
                        id="email" 
                        type="email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                    />
                    <FormText>Your email address.</FormText>
                </FormGroup>

                <FormGroup>
                    <Label for="password">Password</Label>
                    <Input 
                        id="password" 
                        type="password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                    />
                    <FormText>Your account password.</FormText>
                </FormGroup>

                <FormGroup>
                    <Label for="dob">Date of Birth</Label>
                    <Input 
                        id="dob" 
                        type="date" 
                        value={dob} 
                        onChange={(e) => setDob(e.target.value)} 
                    />
                    <FormText>Your date of birth.</FormText>
                </FormGroup>

                <FormGroup>
                    <Label for="phone_number">Phone Number</Label>
                    <Input 
                        id="phone_number" 
                        value={phone_number} 
                        onChange={(e) => setPhoneNumber(e.target.value)} 
                    />
                    <FormText>Your contact number.</FormText>
                </FormGroup>

                <Button type="submit" color="primary">Register</Button>
            </Form>
        </div>
        </>
    );
};

export default Register;
