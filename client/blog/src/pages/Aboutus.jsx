import React from 'react';
import { 
  Box, 
  Typography, 
  Container,
  Avatar,
  Paper,
  Stack
} from '@mui/material';
import Nav from '../components/navbar';

const AboutUsPage = () => {
  const faqs = [
    {
      question: "Question 1?",
      answer: "Answer to question 1 goes here."
    },
    {
      question: "Question 2?", 
      answer: "Answer to question 2 goes here."
    },
    {
      question: "Question 3?",
      answer: "Answer to question 3 goes here."
    },
    {
      question: "Question 4?",
      answer: "Answer to question 4 goes here."
    }
  ];

  

  return (
    <>
    <Nav/>
    <Box sx={{
      background: 'linear-gradient(to bottom, #0f0f1a, #1a1a2e)',
      minHeight: '100vh',
      p: 8,
      color: 'white'
    }}>
      <Container maxWidth="md">
        {/* Header Section */}
        <Box mb={12}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Avatar
              sx={{
                width: 96,
                height: 96,
                bgcolor: 'rgb(60, 60, 60)'
              }}
            />
            <Box flex={1}>
              <Typography variant="h3" fontWeight="bold" mb={2}>
               Prince Chaniyara
              </Typography>
              <Typography color="grey.400">
                Full Stack Developer
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Main Content */}
        <Stack spacing={12}>
          {/* About Section */}
          <Box>
            <Typography variant="h4" fontWeight={600} mb={4}>
              About Pulsh
            </Typography>
            <Paper
              sx={{
                bgcolor: 'rgb(45, 45, 45)',
                p: 6,
                borderRadius: 2
              }}
            >
              <Typography>
                About Pulsh content goes here. This section can be expanded with more details about Pulsh, its mission, values, or any other relevant information.
              </Typography>
            </Paper>
          </Box>

          {/* FAQ Section */}
          <Box>
            <Typography variant="h4" fontWeight={600} mb={4}>
              FAQ
            </Typography>
            <Stack spacing={4}>
              {faqs.map((faq, index) => (
                <Paper
                  key={index}
                  sx={{
                    bgcolor: 'rgb(45, 45, 45)',
                    p: 4,
                    borderRadius: 2
                  }}
                >
                  <Typography fontWeight={600} mb={2}>
                    {faq.question}
                  </Typography>
                  <Typography color="grey.400">
                    {faq.answer}
                  </Typography>
                </Paper>
              ))}
            </Stack>
          </Box>
        </Stack>
      </Container>
    </Box>
    </>
  );
};

export default AboutUsPage;
