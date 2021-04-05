import React, { useState, useEffect } from "react";

export default function ToDoList() {
	const [tasks, setTasks] = useState([]);
	const [task, setTask] = useState("");

	let url = "https://assets.breatheco.de/apis/fake/todos/user/SergioCoto";

	const createUser = () =>
		fetch(url, {
			method: "POST",
			body: JSON.stringify([]),
			headers: {
				"Content-Type": "application/json"
			}
		})
			.then(response => {
				console.log("POST request: ", response.ok);
				response.status >= 200 && response.status < 300
					? console.log("POST successful, status: ", response.status)
					: console.error("POST failed, status: ", response.status);
				return response.json();
			})
			.then(response => console.log(response))
			.then(() => getList())
			.catch(error => console.error("Error: ", error));

	const getList = () =>
		fetch(url, {
			method: "GET",
			headers: {
				"Content-Type": "application/json"
			}
		})
			.then(response => {
				console.log("GET request: ", response.ok);
				response.status >= 200 && response.status < 300
					? console.log("GET successful, status: ", response.status)
					: console.error("GET failed, status: ", response.status);

				return response.json();
			})
			.then(data => {
				setTasks(data);
				console.log(
					"GET array from server (includes hidden default 'sample task'): ",
					data
				);
			})
			.catch(error => {
				console.error("GET request error: ", error);
			});

	const updateList = () =>
		fetch(url, {
			method: "PUT",
			body: JSON.stringify(tasks),
			headers: {
				"Content-Type": "application/json"
			}
		})
			.then(resp => {
				console.log("PUT request: ", resp.ok);
				resp.status >= 200 && resp.status < 300
					? console.log("PUT successful, status: ", resp.status)
					: console.error("PUT failed, status: ", resp.status);
				return resp.json();
			})
			.then(response => {
				setTask("");
				console.log(
					"(Result counter includes hidden default 'sample task')",
					response
				);
			})
			.catch(error => console.error("Error: ", error));

	const deleteList = () => {
		fetch(url, {
			method: "DELETE",
			headers: {
				"Content-Type": "application/json"
			}
		})
			.then(resp => {
				console.log("DELETE request: ", resp.ok);
				resp.status >= 200 && resp.status < 300
					? console.log("DELETE successful, status: ", resp.status)
					: console.error("DELETE failed, status: ", resp.status);
				return resp.json();
			})
			.then(response => console.log("DELETE response: ", response))
			.then(() => setTasks([]))
			.then(() => createUser())
			.catch(error => console.error("Error: ", error));
	};

	const handleAddToList = event => {
		if (event.keyCode == 13 && task !== "" && task !== "sample task") {
			let newTask = { label: task, done: false };
			tasks.splice(tasks.length, 0, newTask);
			setTasks([...tasks]);
			updateList();
		} else if (task == "sample task")
			alert("'sample task' is not a valid input");
	};

	const handleRemoveToList = index => {
		if (task !== "sample task") {
			tasks.splice(index, 1);
			setTasks([...tasks]);
			tasks.length > 0 ? updateList() : deleteList();
		}
	};

	useEffect(() => {
		tasks.length > 0 ? getList() : createUser();
	}, []);

	return (
		<div className="card">
			<h1 className="todo-header">To do List</h1>
			<input
				type="text"
				placeholder="What needs to be done?"
				onChange={event => setTask(event.target.value)}
				value={task}
				onKeyUp={handleAddToList}
			/>

			<ul>
				{tasks.map((element, index) => (
					<li key={index}>
						{
							<span>
								<i
									className="fa fa-trash"
									type="button"
									onClick={() =>
										handleRemoveToList(index)
									}></i>
							</span>
						}
						{element.label}
					</li>
				))}
			</ul>
			<p className="d-flex justify-content-between align-items-center">
				{tasks.length < 2
					? "There are no pending tasks"
					: tasks.length == 2
					? tasks.length - 1 + " item left"
					: tasks.length - 1 + " items left"}
				<button
					type="button"
					className="btn btn-secondary btn-sm m-1"
					onClick={deleteList}>
					Delete All
				</button>
			</p>
		</div>
	);
}
