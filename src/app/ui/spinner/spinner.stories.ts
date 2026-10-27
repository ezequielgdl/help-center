import type { Meta, StoryObj } from '@storybook/angular-vite';
import { Spinner } from './spinner';

const meta: Meta<Spinner> = {
  title: 'UI/Spinner',
  component: Spinner,
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'radio', options: ['sm', 'md', 'lg'] },
  },
  args: {
    size: 'md',
    label: 'Loading',
  },
  render: (args) => ({
    props: args,
    template: `<app-spinner [size]="size" [label]="label"></app-spinner>`,
  }),
};

export default meta;
type Story = StoryObj<Spinner>;

export const Small: Story = {
  args: { size: 'sm' },
};

export const Medium: Story = {
  args: { size: 'md' },
};

export const Large: Story = {
  args: { size: 'lg' },
};
