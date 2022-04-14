import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { Button } from "reactstrap";
import axios from "axios";

class SensitiveInfo extends Component {
  state = {
    message: ""
  };

  async componentDidMount() {
    const { handleAddErrorMessages, handleAddSuccessMessage } = this.props;
    const jwt = localStorage.getItem("jwt");
    if (!jwt) {
      handleAddErrorMessages([{ msg: "Not logged in. Please login." }]);
      this.props.history.push("/login");
      return;
    }

    try {
      const response = await axios.get(
        `${process.env.REACT_APP_SERVER_URL}/user/sensitiveinfo`,
        {
          headers: {
            authorization: `Bearer ${jwt}`
          }
        }
      );
      handleAddSuccessMessage("Retrieved sensitive info from server.");
      this.setState({ message: response.data.msg });
    } catch (err) {
      if (err.response) {
        if (err.response.status === 401) {
          localStorage.removeItem("jwt");
          this.props.history.push("/login");
        }
        handleAddErrorMessages(err.response.data.errors);
      } else {
        handleAddErrorMessages([
          { msg: "Something went wrong. Please try again." }
        ]);
      }
    }
  }

  handleLogout = () => {
    localStorage.removeItem("jwt");
    this.props.handleAddSuccessMessage("Logged out successfully.");
    this.props.history.push("/login");
  };

  render() {
    return (
      <div>
        <h1>Sensitive Info</h1>
        <h2>Server Response: {this.state.message}</h2>
        <hr />
        <Button color="danger" size="sm" onClick={this.handleLogout}>
          Logout
        </Button>
      </div>
    );
  }
}

export default withRouter(SensitiveInfo);
