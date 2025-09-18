
import { render, screen, fireEvent } from '../src/test-utils';
import userEvent from '@testing-library/user-event';
import { MessageInput } from './MessageInput';
import { vi } from 'vitest';

describe('MessageInput', () => {
  it('renders the component', () => {
    render(<MessageInput />);
    expect(screen.getByPlaceholderText('Imagine Something...✦˚')).toBeInTheDocument();
  });

  it('allows typing in the text area', () => {
    render(<MessageInput />);
    const textarea = screen.getByPlaceholderText('Imagine Something...✦˚');
    fireEvent.change(textarea, { target: { value: 'Hello, world!' } });
    expect(textarea.value).toBe('Hello, world!');
  });

  it('sends a message when the send button is clicked', () => {
    render(<MessageInput />);
    const textarea = screen.getByPlaceholderText('Imagine Something...✦˚');
    const sendButton = screen.getByLabelText('Send message');

    fireEvent.change(textarea, { target: { value: 'Hello, world!' } });
    fireEvent.click(sendButton);

    expect(textarea.value).toBe('');
  });

  it('sends a message when the Enter key is pressed', () => {
    render(<MessageInput />);
    const textarea = screen.getByPlaceholderText('Imagine Something...✦˚');

    fireEvent.change(textarea, { target: { value: 'Hello, world!' } });
    fireEvent.keyDown(textarea, { key: 'Enter', code: 'Enter' });

    expect(textarea.value).toBe('');
  });

  it('displays an error message for a large file', async () => {
    render(<MessageInput />);
    const file = new File(['hello'], 'hello.png', { type: 'image/png' });
    Object.defineProperty(file, 'size', { value: 5 * 1024 * 1024 });

    const input = screen.getByTestId('file-input-v2');
    await userEvent.upload(input, file);

    expect(screen.getByText('File size exceeds 4MB.')).toBeInTheDocument();
  });

  it('displays an error message for a non-image file', async () => {
    render(<MessageInput />);
    const file = new File(['hello'], 'hello.txt', { type: 'text/plain' });

    const input = screen.getByTestId('file-input-v2');
    await userEvent.upload(input, file);

    expect(screen.getByText('Only image files are supported.')).toBeInTheDocument();
  });
});

