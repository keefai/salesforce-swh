import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

export const UserData = ({ data }) => {
  return (
    <Paper>
      <Table>
        <TableBody>
          <TableRow>
              <TableCell component="th" scope="row">User ID</TableCell>
              <TableCell>{data['user_id']}</TableCell>
          </TableRow>
          <TableRow>
              <TableCell component="th" scope="row">Organization ID</TableCell>
              <TableCell>{data['organization_id']}</TableCell>
          </TableRow>
          <TableRow>
              <TableCell component="th" scope="row">Username</TableCell>
              <TableCell>{data['username']}</TableCell>
          </TableRow>
          <TableRow>
              <TableCell component="th" scope="row">Nick Name</TableCell>
              <TableCell>{data['nick_name']}</TableCell>
          </TableRow>
          <TableRow>
              <TableCell component="th" scope="row">Display Name</TableCell>
              <TableCell>{data['display_name']}</TableCell>
          </TableRow>
          <TableRow>
              <TableCell component="th" scope="row">Email</TableCell>
              <TableCell>{data['email']}</TableCell>
          </TableRow>
          <TableRow>
              <TableCell component="th" scope="row">Timezone</TableCell>
              <TableCell>{data['timezone']}</TableCell>
          </TableRow>
          <TableRow>
              <TableCell component="th" scope="row">User Type</TableCell>
              <TableCell>{data['user_type']}</TableCell>
          </TableRow>

        </TableBody>
      </Table>
    </Paper>
  );
}

export default UserData;