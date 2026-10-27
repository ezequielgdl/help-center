import type { Meta, StoryObj } from '@storybook/angular-vite';
import { Button } from './button';

const meta: Meta<Button> = {
  title: 'UI/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'radio', options: ['primary', 'secondary'] },
  },
  args: {
    variant: 'primary',
    disabled: false,
    loading: false,
  },
  render: (args) => ({
    props: args,
    template: `<app-button [variant]="variant" [disabled]="disabled" [loading]="loading">Button</app-button>`,
  }),
};

export default meta;
type Story = StoryObj<Button>;

export const Primary: Story = {
  args: { variant: 'primary' },
};

export const Secondary: Story = {
  args: { variant: 'secondary' },
};

export const Disabled: Story = {
  args: { disabled: true },
};

export const Loading: Story = {
  args: { loading: true },
};
