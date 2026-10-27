import type { Meta, StoryObj } from '@storybook/angular-vite';
import { Input } from './input';

const meta: Meta<Input> = {
  title: 'UI/Input',
  component: Input,
  tags: ['autodocs'],
  args: {
    label: 'Email',
    placeholder: 'you@example.com',
    disabled: false,
    error: null,
  },
  render: (args) => ({
    props: args,
    template: `<app-input [label]="label" [placeholder]="placeholder" [disabled]="disabled" [error]="error"></app-input>`,
  }),
};

export default meta;
type Story = StoryObj<Input>;

export const Default: Story = {};

export const WithError: Story = {
  args: { error: 'Enter a valid email address.' },
};

export const Disabled: Story = {
  args: { disabled: true },
};
