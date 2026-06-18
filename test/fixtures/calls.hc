I64 Add(I64 a, I64 b)
{
  return a + b;
}

U0 Driver()
{
  I64 sum = Add(2, 3);
  "%ld\n", sum;
}