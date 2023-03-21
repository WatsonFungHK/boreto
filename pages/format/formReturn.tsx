/**
 * this is a follow up of the last message
 * remember the schema I just sent to you in the last message?
 * let me remind you:
model Role {
  id          String           @id @default(cuid())
  name        String
  description String?
  permissions RolePermission[]
  users       UserRole[]
  companyId   String
  company     Company          @relation(fields: [companyId], references: [id])
  created_at  DateTime         @default(now())
  status      String           @default("A") // 'A' = Active, 'I' = Inactive, 'D' = Deleted
  updated_at  DateTime?        @updatedAt
}

 */
/**
 * generate the code based on how I wrote the schema and example
 * just write the return value like the example
 * dont include anything else, like import statements,
 * 
 * bad example:
 * <TextField
    id={first_name} // wrong, dont use id
    label={t("first_name")} // wrong, dont use label
    {...register("first_name")}
    error={!!errors.first_name}
    helperText={errors.first_name?.message}
    fullWidth
  />

  good example:
   <Stack spacing={1}> // good, use Stack to wrap the subtitle and textfield
    <Typography>{t("last_name")}</Typography> // good, use Typography
    <TextField
      {...register("last_name")}
      error={!!errors.first_name}
      helperText={errors.first_name?.message}
      fullWidth
    />
  </Stack>

 * 
 * full good example:
 * return (
    <Stack spacing={2}>
      <Typography variant="h5">
        {isNew ? t("create-customer") : t("review-customer")}
      </Typography>
      <FormProvider {...methods}>
        <Stack spacing={2} direction="column">
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Stack spacing={1}>
                <Typography>{t("first_name")}</Typography>
                <TextField
                  {...register("first_name")}
                  error={!!errors.first_name}
                  helperText={errors.first_name?.message}
                  fullWidth
                />
              </Stack>
            </Grid>
            <Grid item xs={6}>
              <Stack spacing={1}>
                <Typography>{t("last_name")}</Typography>
                <TextField
                  {...register("last_name")}
                  error={!!errors.first_name}
                  helperText={errors.first_name?.message}
                  fullWidth
                />
              </Stack>
            </Grid>
          </Grid>
          <Stack spacing={1}>
            <Typography>{t("gender")}</Typography>
            <FormControl fullWidth error={!!errors.gender}>
              // use controller for select !!!
              <Controller
                control={methods.control}
                name="gender"
                render={({ field }) => (
                  <Select {...field}>
                    {GENDERS.map(({ value, label }) => {
                      return (
                        <MenuItem value={value} key={value}>
                        {t(label)}
                        </MenuItem>
                        );
                      })}
                    </Select>
                  )}
              />
            </FormControl>
          </Stack>
          <Stack spacing={1}>
            <Typography>{t("Credit")}</Typography>
            <TextField
              type="number"
              inputProps={{ min: 0 }}
              {...register("credit_amount")}
              error={!!errors.credit_amount}
              helperText={errors.credit_amount?.message}
              fullWidth
            />
          </Stack>
          <Stack spacing={1}>
            <Typography>{t("birth_date")}</Typography>
            <TextField
              type="date"
              {...register("birth_date")}
              error={!!errors.birth_date}
              helperText={errors.birth_date?.message}
              fullWidth
            />
          </Stack>
          <LoadingButton
            type="submit"
            variant="contained"
            loading={isLoading}
            onClick={handleSubmit(onSubmit)}
          >
            {t(isNew ? "create" : "update")}
          </LoadingButton>
        </Stack>
      </FormProvider>
    </Stack>
  );
 */

/**
 * generate the form now

 */
