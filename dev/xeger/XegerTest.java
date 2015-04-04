/**
 * Copyright 2009 Wilfred Springer
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package xeger;


public class XegerTest {
	public int main(String[] args)
	{
		shouldGenerateTextCorrectly();
	}

    public void shouldGenerateTextCorrectly() {
        String regex = "[ab]{4,6}c";
        Xeger generator = new Xeger(regex);
        for (int i = 0; i < 100; i++) {
            String text = generator.generate();
            System.out.println()
            System.out.println(text.matches(regex));
        }
    }

}