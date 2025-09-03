'use client'

import * as React from 'react';
import { Button, Grid, Typography } from "@mui/material";
import Link from 'next/link'

export default function Homepage() {
    return (
      <div>
        <Grid container spacing={2}>
        <Grid style={{display: 'flex', justifyContent: 'end', height: '100vh', alignItems: 'center'}} size={6}>
          <Typography>Take your content creation to the next level</Typography>
        </Grid>
        <Grid style={{display: 'flex', justifyContent: 'start', height: '100vh', alignItems: 'center'}} size={6}>
          <Link href={'/templates'}> <Button>Get Started</Button></Link>
        </Grid>
      </Grid>
      </div>

    )
}