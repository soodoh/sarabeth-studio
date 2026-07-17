import { type JSX, type SyntheticEvent, useState } from "react";
import LoadingCircle from "@/components/loading-circle";
import { Button } from "@/components/ui/button";
import Input from "@/components/ui/input";
import Label from "@/components/ui/label";
import Textarea from "@/components/ui/textarea";
import WidthContainer from "@/components/width-container";
import { brandButtonClasses, cn } from "@/lib/utils";
import { emailFieldLimits, isValidEmailField } from "@/utils/email";
import type { EmailData } from "@/utils/types";

type SendState = "success" | "fail" | undefined;

type TextFieldProps = {
	id: "Name" | "Email" | "Subject";
	value: string;
	error: boolean;
	loading: boolean;
	errorMessage: string;
	maxLength: number;
	onChange: (value: string) => void;
};

type MessageFieldProps = {
	value: string;
	error: boolean;
	loading: boolean;
	onChange: (value: string) => void;
};

const isInvalid = (values: Partial<EmailData>): boolean =>
	(values.name !== undefined && !isValidEmailField("name", values.name)) ||
	(values.email !== undefined && !isValidEmailField("email", values.email)) ||
	(values.subject !== undefined &&
		!isValidEmailField("subject", values.subject)) ||
	(values.message !== undefined &&
		!isValidEmailField("message", values.message));

const fieldClasses = "py-2.5 text-base font-sans";

const labelClasses =
	"text-sm font-medium text-accent has-[+_*:focus]:text-foreground";

const ContactTextField = ({
	id,
	value,
	error,
	loading,
	errorMessage,
	maxLength,
	onChange,
}: TextFieldProps): JSX.Element => (
	<div className="my-4 w-[60%] max-sm:w-full">
		<div className="space-y-1.5">
			<Label htmlFor={id} className={cn(labelClasses, error && "text-red-600")}>
				{id}
			</Label>
			<Input
				className={cn(fieldClasses, error && "!border-red-600")}
				name={id}
				id={id}
				disabled={loading}
				maxLength={maxLength}
				onChange={(event) => onChange(event.target.value)}
				type={id === "Email" ? "email" : "text"}
				value={value}
				aria-invalid={error}
				aria-required="true"
				aria-describedby={`${id}-error`}
				required
			/>
			{error && (
				<p
					role="alert"
					id={`${id}-error`}
					className="text-[0.8rem] text-red-600"
				>
					{errorMessage}
				</p>
			)}
		</div>
	</div>
);

const ContactMessageField = ({
	value,
	error,
	loading,
	onChange,
}: MessageFieldProps): JSX.Element => (
	<div className="my-4">
		<div className="space-y-1.5">
			<Label
				htmlFor="Message"
				className={cn(labelClasses, error && "text-red-600")}
			>
				Message
			</Label>
			<Textarea
				className={cn(fieldClasses, "resize-none", error && "!border-red-600")}
				name="Message"
				id="Message"
				disabled={loading}
				maxLength={emailFieldLimits.message}
				onChange={(event) => onChange(event.target.value)}
				value={value}
				aria-invalid={error}
				aria-required="true"
				aria-describedby="Message-error"
				rows={10}
				required
			/>
			{error && (
				<p
					role="alert"
					id="Message-error"
					className="text-[0.8rem] text-red-600"
				>
					&quot;Message&quot; is a required field
				</p>
			)}
		</div>
	</div>
);

const ContactContent = (): JSX.Element => {
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [subject, setSubject] = useState("");
	const [message, setMessage] = useState("");
	const [showErrors, setShowErrors] = useState(false);
	const [loading, setLoading] = useState(false);
	const [sendState, setSendState] = useState<SendState>(undefined);
	const data: EmailData = { name, email, subject, message };

	const resetForm = (): void => {
		setName("");
		setEmail("");
		setSubject("");
		setMessage("");
	};

	const submit = async (
		event: SyntheticEvent<HTMLFormElement>,
	): Promise<void> => {
		event.preventDefault();
		if (isInvalid(data)) {
			setShowErrors(true);
			return;
		}

		setLoading(true);
		setSendState(undefined);
		try {
			const response = await fetch("/api/email", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(data),
			});
			if (!response.ok) {
				setSendState("fail");
				return;
			}

			setShowErrors(false);
			resetForm();
			setSendState("success");
		} catch {
			setSendState("fail");
		} finally {
			setLoading(false);
		}
	};

	const nameError = showErrors && isInvalid({ name });
	const emailError = showErrors && isInvalid({ email });
	const subjectError = showErrors && isInvalid({ subject });
	const messageError = showErrors && isInvalid({ message });

	return (
		<WidthContainer className="flex flex-col [&>h1]:mx-auto [&>h1]:my-16">
			{sendState === "success" && <h1>Message successfully sent!</h1>}
			{sendState === "fail" && <h1>Message failed to send</h1>}
			{sendState !== "success" && (
				<form onSubmit={submit} noValidate>
					<ContactTextField
						id="Name"
						value={name}
						error={nameError}
						loading={loading}
						onChange={setName}
						errorMessage='"Name" is a required field'
						maxLength={emailFieldLimits.name}
					/>
					<ContactTextField
						id="Email"
						value={email}
						error={emailError}
						loading={loading}
						onChange={setEmail}
						errorMessage="Please enter a valid email"
						maxLength={emailFieldLimits.email}
					/>
					<ContactTextField
						id="Subject"
						value={subject}
						error={subjectError}
						loading={loading}
						onChange={setSubject}
						errorMessage='"Subject" is a required field'
						maxLength={emailFieldLimits.subject}
					/>
					<ContactMessageField
						value={message}
						error={messageError}
						loading={loading}
						onChange={setMessage}
					/>
					<div className="my-4 w-[60%] max-sm:w-full">
						{loading ? (
							<LoadingCircle />
						) : (
							<Button
								type="submit"
								variant="unstyled"
								size="unstyled"
								className={brandButtonClasses}
							>
								Submit
							</Button>
						)}
					</div>
				</form>
			)}
		</WidthContainer>
	);
};

export default ContactContent;
