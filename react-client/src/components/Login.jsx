import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import axios from "axios";
import { FormGroup, Label, Input, Button, Form } from "reactstrap";

class Login extends Component {
  state = {
    email: "",
    password: "",
    waiting: false
  };

  componentDidMount() {
    const jwt = localStorage.getItem("jwt");
    if (jwt) {
      this.props.handleAddSuccessMessage("Token found.");
      this.props.history.push("/");
    }
  }

  handleInputChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleSubmit = async event => {
    event.preventDefault();
    this.setState({ waiting: true });
    const { email, password } = this.state;
    const { handleAddErrorMessages, handleAddSuccessMessage } = this.props;
    if (!email || !password) {
      handleAddErrorMessages([
        { msg: "Email and Password are required fields." }
      ]);
      this.setState({ waiting: false });
      return;
    }
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/user/login`,
        {
          email,
          password
        }
      );
      this.setState({ waiting: false });
      localStorage.setItem("jwt", response.data.jwt);
      handleAddSuccessMessage(response.data.msg);
      this.props.history.push("/");
    } catch (err) {
      this.setState({ waiting: false });
      if (err.response) {
        handleAddErrorMessages(err.response.data.errors);
      } else {
        handleAddErrorMessages([
          { msg: "Something went wrong. Please try again." }
        ]);
      }
    }
  };

  loginForm = () => (
    <Form>
      <FormGroup>
        <Label>Email</Label>
        <Input
          type="email"
          name="email"
          placeholder="Please enter email"
          required
          value={this.state.email}
          onChange={this.handleInputChange}
        />
      </FormGroup>
      <FormGroup>
        <Label>Password</Label>
        <Input
          type="password"
          name="password"
          placeholder="Please enter password"
          required
          value={this.state.password}
          onChange={this.handleInputChange}
        />
      </FormGroup>
      {this.state.waiting && (
        <Button color="primary" disabled>
          Please wait...
        </Button>
      )}
      {!this.state.waiting && (
        <Button color="primary" onClick={this.handleSubmit} type="submit">
          Login
        </Button>
      )}
    </Form>
  );

  render() {
    return (
      <div>
        <h1>Login</h1>
        {this.loginForm()}
        <hr />
        <Button
          color="danger"
          size="sm"
          onClick={() => {
            this.props.history.push("/signup");
          }}
        >
          Signup Page
        </Button>
      </div>
    );
  }
}

export default withRouter(Login);
