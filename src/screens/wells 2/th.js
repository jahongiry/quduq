import React from 'react';
import { Table, UnstyledButton, Group, Text, Center, rem } from '@mantine/core';
import { IconSelector, IconChevronDown, IconChevronUp } from '@tabler/icons-react';
import classes from './wells.module.css';
import PropTypes from 'prop-types';

class Th extends React.Component {
  render() {
    const Icon = this.props.sorted ? (this.props.reversed ? IconChevronUp : IconChevronDown) : IconSelector;
    return (
      <Table.Th className={classes.th}>
        <UnstyledButton onClick={this.props.onSort} className={classes.control}>
          <Group justify="space-between">
            <Text fw={500} fz="sm">
              {this.props.children}
            </Text>
            {this.props.disabled ? null : (
              <Center className={classes.icon}>
                <Icon style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
              </Center>
            )}
          </Group>
        </UnstyledButton>
      </Table.Th>
    );
  }
}
Th.propTypes = {
  sorted: PropTypes.any,
  reversed: PropTypes.any,
  children: PropTypes.any,
  onSort: PropTypes.any,
  disabled: PropTypes.any
};
export default Th;
