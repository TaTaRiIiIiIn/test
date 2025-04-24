import "@testing-library/jest-dom";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { FeedbackForm } from "../components/FeedbackForm";
import { act } from "@testing-library/react";

describe("FeedbackForm", () => {
  it("Проверка заголовка", () => {
    render(<FeedbackForm />);
    expect(screen.getByText("Обратная связь")).toBeInTheDocument();
  });

  it("Ввод имени и сообщения", async () => {
    render(<FeedbackForm />);
    const nameInput = screen.getByPlaceholderText("Ваше имя");
    const messageInput = screen.getByPlaceholderText("Ваше сообщение");

    await userEvent.type(nameInput, "Алексей");
    await userEvent.type(messageInput, "Привет, мир!");

    expect(nameInput).toHaveValue("Алексей");
    expect(messageInput).toHaveValue("Привет, мир!");
  });

  it("Отправка формы с валидными данными", async () => {
    render(<FeedbackForm />);

    fireEvent.change(screen.getByPlaceholderText("Ваше имя"), {
      target: { value: "Иван" },
    });

    fireEvent.change(screen.getByPlaceholderText("Ваше сообщение"), {
      target: { value: "Хочу оставить отзыв" },
    });

    fireEvent.click(screen.getByText("Отправить"));

    await waitFor(() =>
      expect(
        screen.getByText("Спасибо, Иван! Ваше сообщение отправлено.")
      ).toBeInTheDocument()
    );
  });

  it("Сообщение не отправляется при пустом вводе", async () => {
    render(<FeedbackForm />);
    await userEvent.click(screen.getByText("Отправить"));

    expect(screen.queryByText(/Спасибо/)).not.toBeInTheDocument();
  });

  it("Кнопка существует и активна", () => {
    render(<FeedbackForm />);
    const button = screen.getByText("Отправить");
    expect(button).toBeInTheDocument();
    expect(button).toBeEnabled();
  });

  it("trim-валидация: пробелы не проходят", async () => {
    render(<FeedbackForm />);
    await userEvent.type(screen.getByPlaceholderText("Ваше имя"), "   ");
    await userEvent.type(screen.getByPlaceholderText("Ваше сообщение"), "    ");
    await userEvent.click(screen.getByText("Отправить"));

    expect(screen.queryByText(/Спасибо/)).not.toBeInTheDocument();
  });
});
