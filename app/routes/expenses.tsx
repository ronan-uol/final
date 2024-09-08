import { useState } from "react";
import { Form, useLoaderData } from "@remix-run/react";
import { AuthenticatedLayout } from "~/components/authenticatedLayout";
import { LoaderFunctionArgs, json, redirect } from "@remix-run/node";
import { authenticator } from "services/auth/authService.server";
import { ROUTES } from "~/constants";
import { addExpense, getExpenses } from "~/services/expenses.service";

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await authenticator.isAuthenticated(request);

  if (!user) {
    return redirect(ROUTES.LOGIN);
  }

  const expenses = await getExpenses(user.id);

  return json({ user, expenses });
}

export async function action({ request }: LoaderFunctionArgs) {
  const user = await authenticator.isAuthenticated(request);

  if (!user) {
    return redirect(ROUTES.LOGIN);
  }

  const formData = await request.formData();

  const { amount, description } = Object.fromEntries(formData);

  console.log({ amount, description, formData });

  return await addExpense(user.id, Number(amount), description.toString());
}

export default function ExpenseTracker() {
  const { user, expenses } = useLoaderData();

  const calculateBalance = (user, expenses) => {
    const userAmount = expenses
      .filter((expense) => expense.author === user.name)
      .reduce((total, expense) => total + expense.amount, 0);
    const partnerAmount = expenses
      .filter((expense) => expense.author !== user.name)
      .reduce((total, expense) => total + expense.amount, 0);
    return userAmount - partnerAmount;
  };

  const balance = calculateBalance(user, expenses);

  return (
    <AuthenticatedLayout user={user}>
      <div className="min-h-screen bg-blue-100 p-4 md:p-6 lg:p-8">
        <header className="max-w-screen-xl mx-auto mb-4 md:mb-8 text-left">
          <h1 className="text-3xl md:text-5xl font-extrabold text-gray-800">
            Expense Tracker
          </h1>
          <p className="text-lg md:text-xl mt-2 text-gray-600">
            Keep track of shared expenses and see how much each person owes.
          </p>
        </header>

        <main className="max-w-screen-xl mx-auto">
          <div className="bg-white shadow-lg rounded-lg p-6 mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
              Add New Expense
            </h2>
            <Form method="post" className="space-y-4 mb-8">
              <div>
                <label className="block text-gray-700">Amount</label>
                <input
                  type="number"
                  name="amount"
                  className="w-full p-2 mt-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-gray-700">Description</label>
                <input
                  type="text"
                  name="description"
                  className="w-full p-2 mt-2 border border-gray-300 rounded-md"
                />
              </div>
              <button
                type="submit"
                className="bg-blue-600 text-white py-2 px-4 rounded-full font-semibold shadow hover:bg-blue-700 transition duration-300"
              >
                Add Expense
              </button>
            </Form>

            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4 text-left">
              Expense Summary
            </h2>
            <div className="flex justify-left mb-8">
              <div
                className={`md:w-1/2 bg-${
                  balance >= 0 ? "green" : "red"
                }-100 p-4 rounded-lg shadow-md border-l-4 ${
                  balance >= 0 ? "border-green-500" : "border-red-500"
                }`}
              >
                <h3 className="text-xl font-semibold text-gray-800 text-center">
                  {balance >= 0 ? "You Are Owed" : "You Owe"}
                </h3>
                <p
                  className={`text-3xl text-center ${
                    balance >= 0 ? "text-green-700" : "text-red-700"
                  }`}
                >
                  ${Math.abs(balance).toFixed(2)}
                </p>
              </div>
            </div>

            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
              Expense History
            </h2>
            <div className="space-y-4">
              {expenses.map((expense) => (
                <div
                  key={expense.id}
                  className="bg-gray-100 p-4 rounded-lg shadow-md"
                >
                  <p className="text-gray-800">
                    <strong>{expense.author}</strong> spent{" "}
                    <strong>${expense.amount.toFixed(2)}</strong> on{" "}
                    <strong>{expense.description}</strong>
                  </p>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </AuthenticatedLayout>
  );
}
